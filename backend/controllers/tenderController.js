const Tender = require('../models/Tender');
const aiService = require('../services/aiService');
const path = require('path');

// Upload and Parse Tender
const uploadTender = async (req, res) => {
  try {
    const { title, description, referenceNumber, officerId } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const filePath = req.file.path;

    // Trigger AI Parsing (mocked for now)
    // In real scenario, we'd extract text from PDF using pdf-parse first
    const extractedCriteria = await aiService.parseTenderDocument(filePath);

    const tender = await Tender.create({
      title,
      description,
      referenceNumber,
      filePath,
      criteria: extractedCriteria,
      officerId
    });

    res.status(201).json({
      message: 'Tender uploaded and parsed successfully',
      tender
    });
  } catch (error) {
    console.error('❌ Error uploading tender:', error);
    res.status(500).json({ message: 'Server error during tender upload' });
  }
};

// Get All Tenders
const getAllTenders = async (req, res) => {
  try {
    const { status } = req.query;
    const where = {};
    if (status) {
      where.status = status;
    }
    
    const tenders = await Tender.findAll({
      where,
      order: [['createdAt', 'DESC']]
    });
    res.json(tenders);
  } catch (error) {
    console.error('❌ Error fetching tenders:', error);
    res.status(500).json({ message: 'Server error fetching tenders' });
  }
};

// Get Tender by ID
const getTenderById = async (req, res) => {
  try {
    const tender = await Tender.findByPk(req.params.id);
    if (!tender) {
      return res.status(404).json({ message: 'Tender not found' });
    }
    res.json(tender);
  } catch (error) {
    console.error('❌ Error fetching tender:', error);
    res.status(500).json({ message: 'Server error fetching tender' });
  }
};

// Update Tender Status
const updateTenderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const tender = await Tender.findByPk(req.params.id);
    if (!tender) {
      return res.status(404).json({ message: 'Tender not found' });
    }
    
    tender.status = status;
    await tender.save();
    
    res.json({ message: `Tender status updated to ${status}`, tender });
  } catch (error) {
    console.error('❌ Error updating tender status:', error);
    res.status(500).json({ message: 'Server error updating tender status' });
  }
};

module.exports = {
  uploadTender,
  getAllTenders,
  getTenderById,
  updateTenderStatus
};
