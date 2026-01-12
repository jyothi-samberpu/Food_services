const Product = require('../models/Product');
const Firm = require('../models/Firm');
const path = require('path');
const multer = require('multer');

// Multer config for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname))
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) cb(null, true);
  else cb(new Error('Only image files are allowed!'), false);
};

const upload = multer({ storage, fileFilter });

/**
 * @desc   Add new product
 * @route  POST /product/add
 * @access Protected (vendor)
 */
const addProduct = async (req, res) => {
  try {
    const { name, price, description, category } = req.body;

    if (!name || !price) {
      return res.status(400).json({ error: 'Name and price are required' });
    }

    // Use vendorId from JWT middleware
    const vendorId = req.vendorId;

    // Find vendor's firm
    const firm = await Firm.findOne({ vendor: vendorId });

    const newProduct = new Product({
      productName: name,
      price,
      description,
      category: category ? JSON.parse(category) : [],
      firm: firm ? firm._id : null,
      image: req.file ? req.file.filename : null
    });

    await newProduct.save();

    res.status(201).json({
      message: 'Product added successfully',
      product: newProduct
    });
  } catch (error) {
    console.error('Add Product Error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * @desc   Get all products
 * @route  GET /product/all
 * @access Public
 */
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate('firm');

    res.status(200).json({ products });
  } catch (error) {
    console.error('Get All Products Error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * @desc   Get product by ID
 * @route  GET /product/:id
 * @access Public
 */
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('firm');

    if (!product) return res.status(404).json({ error: 'Product not found' });

    res.status(200).json({ product });
  } catch (error) {
    console.error('Get Product Error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * @desc   Delete product
 * @route  DELETE /product/:id
 * @access Protected (vendor)
 */
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product)
      return res.status(404).json({ error: 'Product not found' });

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete Product Error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  addProduct,
  getAllProducts,
  getProductById,
  deleteProduct,
  upload
};
