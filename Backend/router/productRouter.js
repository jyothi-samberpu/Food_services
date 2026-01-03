const express = require('express');
const productController = require('../controllers/ProductController');
const verifyToken = require('../middlewares/verifyToken');

const router = express.Router();

// Add Product (Protected + Multer upload)
router.post(
  '/add',
  verifyToken,
  productController.upload.single('image'),
  productController.addProduct
);

// Get All Products (Public)
router.get('/all', productController.getAllProducts);

// Get Product by ID (Public)
router.get('/:id', productController.getProductById);

// Delete Product (Protected)
router.delete('/:id', verifyToken, productController.deleteProduct);

module.exports = router;
