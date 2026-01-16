const Firm = require('../models/Firm');
const Vendor = require('../models/Vendor');
const multer = require('multer');
const path = require('path');

/* ---------- Multer Storage ---------- */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

/* ---------- Add Firm Controller ---------- */
const addFirmHandler = async (req, res) => {
  try {
    // Debug: log the request body
    console.log('Add Firm Request Body:', req.body);
    console.log('Add Firm Request File:', req.file);
    
    const { firmname, area, category, region, offer } = req.body;
    
    // Input validation
    if (!firmname || !area || !category) {
      console.log('Validation failed:', { firmname, area, category });
      return res.status(400).json({ 
        error: 'Firmname, area, and category are required',
        received: { firmname, area, category }
      });
    }

    // Get image name if uploaded
    const image = req.file ? req.file.filename : undefined;
    console.log('Image uploaded:', image);

    // Find vendor
    const vendor = await Vendor.findById(req.vendorId);
    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }

    // Parse category if it's a string
    let parsedCategory = category;
    if (typeof category === 'string') {
      try {
        parsedCategory = JSON.parse(category);
      } catch (e) {
        parsedCategory = [category];
      }
    }

    // Create firm
    const firm = new Firm({
      firmname,
      area,
      category: parsedCategory,
      region: region ? [region] : [],
      offer,
      image,
      vendor: vendor._id
    });

    await firm.save();

    // Add firm to vendor's firm array
    vendor.firm.push(firm._id);
    await vendor.save();

    return res.status(201).json({
      message: 'Firm added successfully',
      firm
    });
  } catch (error) {
    console.error('Add Firm Error:', error.message || error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

// Export with upload middleware
const addFirm = [upload.single('image'), addFirmHandler];

/* ---------- Get All Firms ---------- */
const getAllFirms = async (req, res) => {
  try {
    const firms = await Firm.find().populate('vendor', 'username email').lean();
    res.status(200).json({ firms });
  } catch (error) {
    console.error('Get All Firms Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/* ---------- Get Firm by ID ---------- */
const getFirmById = async (req, res) => {
  try {
    const firm = await Firm.findById(req.params.id).populate('vendor', 'username email').lean();
    if (!firm) {
      return res.status(404).json({ error: 'Firm not found' });
    }
    res.status(200).json({ firm });
  } catch (error) {
    console.error('Get Firm Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/* ---------- Delete Firm ---------- */
const deleteFirm = async (req, res) => {
  try {
    const firm = await Firm.findByIdAndDelete(req.params.id);
    if (!firm) {
      return res.status(404).json({ error: 'Firm not found' });
    }
    res.status(200).json({ message: 'Firm deleted successfully' });
  } catch (error) {
    console.error('Delete Firm Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { 
  upload,
  addFirmHandler,
  getAllFirms,
  getFirmById,
  deleteFirm
};
