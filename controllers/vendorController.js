const Vendor =require('../models/Vendor');
const jwt =require('jsonwebtoken');
const bcrypt =require('bcryptjs');
const dotEnv =require('dotenv');


dotEnv.config();

const secretKey=process.env.WHATISYOURWORK

const vendorRegister = async (req, res) => {
    const { username, email, password } = req.body;
    
    // Input validation
    if (!username || !email || !password) {
        return res.status(400).json({ error: 'Username, email, and password are required' });
    }
    if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }
    
    try {
        const existingVendor = await Vendor.findOne({ email });
        if (existingVendor) {
            return res.status(400).json({ error: 'Email already registered' });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const newVendor = new Vendor({ username, email, password: hashedPassword });
        await newVendor.save();
        
        res.status(201).json({ message: 'Vendor registered successfully', vendorId: newVendor._id });
    } catch (error) {
        console.error('Register Error:', error.message || error);
        // Handle MongoDB validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ error: messages.join(', ') });
        }
        if (error.code === 11000) {
            return res.status(400).json({ error: 'Email already registered' });
        }
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
}

const vendorLogin = async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }
    
    try {
        const vendor = await Vendor.findOne({ email });
        if (!vendor || !(await bcrypt.compare(password, vendor.password))) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        
        const token = jwt.sign(
            { vendorId: vendor._id },
            secretKey,
            { expiresIn: '1h' }
        );
        
        res.status(200).json({ success: 'Login Successful', token, vendorId: vendor._id });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const getAllVendors = async (req, res) => {
    try {
        const vendors = await Vendor.find().populate('firm').lean();
        res.status(200).json({ vendors });
    } catch (error) {
        console.error('Get All Vendors Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const getVendorById = async (req, res) => {
    const { id } = req.params;
    
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ error: 'Invalid vendor ID format' });
    }
    
    try {
        const vendor = await Vendor.findById(id).populate('firm').lean();
        if (!vendor) {
            return res.status(404).json({ error: 'Vendor not found' });
        }
        res.status(200).json({ vendor });
    } catch (error) {
        console.error('Get Vendor Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = { vendorRegister, vendorLogin, getAllVendors, getVendorById }