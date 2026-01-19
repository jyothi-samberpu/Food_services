/*const express = require('express');
const firmController = require('../controllers/firmController');
const verifyToken = require('../middlewares/verifyToken');
const multer = require('multer');
const router = express.Router();



router.post('/add-firm',
     verifyToken,
      firmController.addFirm
    );

module.exports = router;*/


const express = require('express');
const router = express.Router();

const firmController = require('../controllers/firmController');
const verifyToken = require('../middlewares/verifyToken');

// 🔍 DEBUG
console.log('verifyToken type:', typeof verifyToken);
console.log('addFirm type:', typeof firmController.addFirm);

router.post('/add-firm', verifyToken, firmController.upload.single('image'), firmController.addFirm);
router.get('/all', firmController.getAllFirms);

module.exports = router;
