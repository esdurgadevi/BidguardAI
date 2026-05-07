const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/authMiddleware');
const bidController = require('../controllers/bidController');

// Configure Multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-bid-${file.originalname}`);
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /pdf|doc|docx|jpg|jpeg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only PDF, Word, and Image files are allowed!'));
  }
});

// @route   POST api/bids/submit
// @desc    Submit a bid (Technical & Financial)
// @access  Private (Bidder only)
router.post('/submit', [auth, upload.fields([
  { name: 'technicalDocs', maxCount: 1 },
  { name: 'financialDocs', maxCount: 1 }
])], bidController.submitBid);

// @route   GET api/bids/my-bids
// @desc    Get all bids submitted by the logged-in bidder
// @access  Private (Bidder only)
router.get('/my-bids', auth, bidController.getMyBids);

// @route   GET api/bids/tender/:tenderId/recommend-best
// @desc    Get AI recommendation for the best bidder
// @access  Private (Officer only)
router.get('/tender/:tenderId/recommend-best', auth, bidController.getBestBidderRecommendation);

// @route   GET api/bids/tender/:tenderId
// @desc    Get all bids for a specific tender
// @access  Private (Officer only)
router.get('/tender/:tenderId', auth, bidController.getBidsByTender);

// @route   GET api/bids/:id
// @desc    Get a single bid by ID
// @access  Private
router.get('/:id', auth, bidController.getBidById);

// @route   PATCH api/bids/:id/status
// @desc    Update bid status (Select/Reject)
// @access  Private (Officer only)
router.patch('/:id/status', auth, bidController.updateBidStatus);

module.exports = router;
