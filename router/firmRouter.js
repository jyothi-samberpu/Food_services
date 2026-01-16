const express = require('express');
const firmController = require('../controllers/firmController');
const verifyToken = require('../middlewares/verifyToken');

const router = express.Router();

// Add Firm (Protected + Multer upload)
router.post(
  '/add-firm',
  verifyToken,
  firmController.upload.single('image'),
  firmController.addFirmHandler
);

// Get All Firms (Public)
router.get('/all', firmController.getAllFirms);

// Get Firm by ID (Public)
router.get('/:id', firmController.getFirmById);

// Delete Firm (Protected)
router.delete('/:id', verifyToken, firmController.deleteFirm);

module.exports = router;
