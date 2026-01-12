const express = require('express');
const firmController = require('../controllers/firmController');
const verifyToken = require('../middlewares/verifyToken');

const router = express.Router();

router.post('/add-firm', verifyToken, firmController.addFirm);
router.get('/all', firmController.getAllFirms);
router.get('/:id', firmController.getFirmById);
router.delete('/:id', verifyToken, firmController.deleteFirm);

module.exports = router;
