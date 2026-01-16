const Product = require('../models/Product');
const Firm = require('../models/Firm');
const mongoose = require('mongoose');
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
    const { productName, price, description, category } = req.body;

    // Input validation
    if (!productName || !price) {
      return res.status(400).json({ error: 'Product name and price are required' });
    }
    if (isNaN(price) || price <= 0) {
      return res.status(400).json({ error: 'Price must be a positive number' });
    }

    const vendorId = req.vendorId;
    const firm = await Firm.findOne({ vendor: vendorId });

    const newProduct = new Product({
      productName: productName,
      price: parseFloat(price),
      description: description || '',
      category: category ? (typeof category === 'string' ? JSON.parse(category) : category) : [],
      firm: firm ? firm._id : null,
      image: req.file ? req.file.filename : null
    });

    await newProduct.save();

    res.status(201).json({
      message: 'Product added successfully',
      product: newProduct
    });
  } catch (error) {
    console.error('Add Product Error:', error);
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
      .populate('firm')
      .lean()
      .select('-__v');

    res.status(200).json({ products });
  } catch (error) {
    console.error('Get All Products Error:', error);
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
      .populate('firm')
      .lean();

    if (!product) return res.status(404).json({ error: 'Product not found' });

    res.status(200).json({ product });
  } catch (error) {
    console.error('Get Product Error:', error);
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

/**
 * @desc   Add product to specific firm
 * @route  POST /product/add/:firmId
 * @access Public (no authentication)
 */
const addProductToFirm = async (req, res) => {
  try {
    const { productName, price, description, category } = req.body;
    const { firmId } = req.params;

    // Input validation
    if (!productName || !price) {
      return res.status(400).json({ error: 'Product name and price are required' });
    }
    if (isNaN(price) || price <= 0) {
      return res.status(400).json({ error: 'Price must be a positive number' });
    }

    // Validate firmId format
    if (!mongoose.Types.ObjectId.isValid(firmId)) {
      return res.status(400).json({ error: 'Invalid firm ID format' });
    }

    // Check if firm exists
    const firm = await Firm.findById(firmId);
    if (!firm) {
      return res.status(404).json({ error: 'Firm not found' });
    }

    const newProduct = new Product({
      productName: productName,
      price: parseFloat(price),
      description: description || '',
      category: category ? (typeof category === 'string' ? JSON.parse(category) : category) : [],
      firm: firmId,
      image: req.file ? req.file.filename : null
    });

    await newProduct.save();

    res.status(201).json({
      message: 'Product added to firm successfully',
      product: newProduct
    });
  } catch (error) {
    console.error('Add Product to Firm Error:', error.message || error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

/**
 * @desc   Get all products by firm ID
 * @route  GET /product/firm/:firmId
 * @access Public
 */
const getProductsByFirmId = async (req, res) => {
  try {
    const { firmId } = req.params;

    // Check if firm exists
    const firm = await Firm.findById(firmId);
    if (!firm) {
      return res.status(404).json({ error: 'Firm not found' });
    }

    const products = await Product.find({ firm: firmId })
      .populate('firm')
      .lean()
      .select('-__v');

    res.status(200).json({
      message: 'Products retrieved successfully',
      firmName: firm.firmname,
      products
    });
  } catch (error) {
    console.error('Get Products by Firm Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  addProduct,
  getAllProducts,
  getProductById,
  deleteProduct,
  addProductToFirm,
  getProductsByFirmId,
  upload
};
