const Bid = require('../models/Bid');
const Tender = require('../models/Tender');
const aiService = require('../services/aiService');

// Submit a new bid
exports.submitBid = async (req, res) => {
  try {
    const { tenderId } = req.body;
    const bidderId = req.user.id;

    if (!req.files || !req.files.technicalDocs || !req.files.financialDocs) {
      return res.status(400).json({ message: 'Both Technical and Financial documents are required.' });
    }

    const technicalDocsPath = req.files.technicalDocs[0].path;
    const financialDocsPath = req.files.financialDocs[0].path;

    // 1. Fetch Tender criteria for AI comparison
    const tender = await Tender.findByPk(tenderId);
    if (!tender) {
      return res.status(404).json({ message: 'Tender not found.' });
    }

    // Check if deadline has passed
    if (tender.deadline && new Date() > new Date(tender.deadline)) {
      return res.status(400).json({ message: 'The submission deadline for this tender has passed.' });
    }

    // 2. Trigger AI Evaluation
    console.log(`🤖 Starting AI Evaluation for Bidder ${bidderId} on Tender ${tenderId}...`);
    const evaluationResults = await aiService.evaluateBidAgainstTender(technicalDocsPath, tender.criteria);

    // 3. Create Bid record
    const bid = await Bid.create({
      tenderId,
      bidderId,
      technicalDocsPath,
      financialDocsPath,
      extractedTechnical: evaluationResults.technical,
      extractedFinancial: evaluationResults.financial,
      aiRecommendation: evaluationResults,
      status: 'PENDING'
    });

    res.status(201).json({
      message: 'Bid submitted and AI evaluation complete.',
      bid
    });

  } catch (err) {
    console.error('❌ Bid Submission Error:', err.message);
    res.status(500).json({ message: 'Server error during bid submission.' });
  }
};

// Get all bids for the logged-in bidder
exports.getMyBids = async (req, res) => {
  try {
    const bids = await Bid.findAll({
      where: { bidderId: req.user.id },
      include: [{ model: Tender, attributes: ['title', 'referenceNumber', 'deadline'] }],
      order: [['createdAt', 'DESC']]
    });
    res.json(bids);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get all bids for a specific tender (Officer only)
exports.getBidsByTender = async (req, res) => {
  try {
    if (req.user.role !== 'CRPF_OFFICER') {
      return res.status(403).json({ message: 'Access denied. Officers only.' });
    }

    const bids = await Bid.findAll({
      where: { tenderId: req.params.tenderId },
      order: [['createdAt', 'DESC']]
    });
    res.json(bids);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Update bid status (Manual Verification)
exports.updateBidStatus = async (req, res) => {
  try {
    if (req.user.role !== 'CRPF_OFFICER') {
      return res.status(403).json({ message: 'Access denied.' });
    }

    const { status } = req.body;
    const bid = await Bid.findByPk(req.params.id);

    if (!bid) {
      return res.status(404).json({ message: 'Bid not found.' });
    }

    bid.status = status;
    await bid.save();

    res.json({ message: `Bid status updated to ${status}`, bid });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
// Get AI recommendation for the best bidder
exports.getBestBidderRecommendation = async (req, res) => {
  try {
    if (req.user.role !== 'CRPF_OFFICER') {
      return res.status(403).json({ message: 'Access denied.' });
    }

    const { tenderId } = req.params;
    const tender = await Tender.findByPk(tenderId);
    const bids = await Bid.findAll({ where: { tenderId } });

    if (!tender || bids.length === 0) {
      return res.status(404).json({ message: 'No bids found for this tender.' });
    }

    console.log(`🤖 AI is predicting the best bidder for Tender ${tenderId}...`);
    const recommendation = await aiService.recommendBestBidder(tender, bids);

    res.json(recommendation);
  } catch (err) {
    console.error('❌ AI Recommendation Error:', err.message);
    res.status(500).json({ message: 'Failed to generate AI recommendation.' });
  }
};

// Get a single bid by ID
exports.getBidById = async (req, res) => {
  try {
    const bid = await Bid.findByPk(req.params.id, {
      include: [{ model: Tender, attributes: ['title', 'referenceNumber', 'deadline'] }]
    });
    if (!bid) return res.status(404).json({ message: 'Bid not found' });
    res.json(bid);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
