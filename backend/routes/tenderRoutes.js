const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const tenderController = require('../controllers/tenderController');

// Configure Multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /pdf|doc|docx/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only .pdf, .doc and .docx files are allowed!'));
  }
});

// Routes
router.post('/upload', upload.single('tenderFile'), tenderController.uploadTender);
router.get('/', tenderController.getAllTenders);
router.get('/:id', tenderController.getTenderById);
router.patch('/:id/status', tenderController.updateTenderStatus);

module.exports = router;
