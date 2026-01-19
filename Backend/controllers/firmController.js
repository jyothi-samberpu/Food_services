/*const Firm = require('../models/Firm');
const Vendor = require('../models/Vendor');
const multer = require('multer');
const path = require('path');


/* ---------- Multer Storage ---------- */
/*const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });*/

/*

const addFirm = async (req, res) => {
  try {
    const { firmname, area, category, region, offer } = req.body;
    const image = req.file ? req.file.filename : undefined;

    const vendor = await Vendor.findById(req.vendorId);
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    const firm = new Firm({
      firmname, area, category, region, offer, image,
      vendor: vendor._id
    });

    const savedFirm = await firm.save();

    // Also push the firm ID to the vendor's firm array if you have one
    vendor.firm.push(savedFirm._id);
    await vendor.save();

    return res.status(200).json({ message: "Firm added successfully", firm: savedFirm });

  } catch (error) {
    console.error("Error details:", error); // This helps you see the REAL error in the terminal
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// FIX: Export them separately
module.exports = { 
    addFirm, 
    upload // Export the multer instance
};
module.exports = { addFirm: [upload.single('image'), addFirm] }; 
*/
/*

const addFirm = async (req, res) => {
  try {
    const { firmname, area, category, region, offer } = req.body;
    const image = req.file ? req.file.filename : undefined;

    const vendor = await Vendor.findById(req.vendorId);
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    const firm = new Firm({
      firmname,
      area,
      // Split string by comma and remove extra spaces
      category: category ? category.split(',').map(c => c.trim()) : [],
      region: region ? region.split(',').map(r => r.trim()) : [],
      offer,
      image,
      vendor: vendor._id
    });

    const savedFirm = await firm.save();

    // Update the vendor's firm reference
    vendor.firm.push(savedFirm._id);
    await vendor.save();

    return res.status(200).json({ message: "Firm added successfully", firm: savedFirm });

  } catch (error) {
    console.error(error);
    res.status(500).json({ 
        message: "Server error", 
        error: error.message // This helps you see validation details in Postman
    });
  }
};
module.exports = { addFirm };
*/
const Firm = require('../models/Firm');
const Vendor = require('../models/Vendor');
const multer = require('multer');
const path = require('path');

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

const addFirm = async (req, res) => {
  try {
    // 🔍 Debug logs (remove later)
    console.log("HEADERS:", req.headers["content-type"]);
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const body = req.body || {};

    const {
      firmname,
      area,
      category,
      region,
      offer
    } = body;

    if (!firmname) {
      return res.status(400).json({
        message: "firmname is required (use form-data)"
      });
    }

    const vendor = await Vendor.findById(req.vendorId);
    if (!vendor) {
      return res.status(404).json({
        message: "Vendor not found"
      });
    }

    const image = req.file ? req.file.filename : null;

    const firm = new Firm({
      firmname,
      area,
      category: category ? category.split(',').map(c => c.trim()) : [],
      region: region ? region.split(',').map(r => r.trim()) : [],
      offer,
      image,
      vendor: vendor._id
    });

    const savedFirm = await firm.save();

    vendor.firm.push(savedFirm._id);
    await vendor.save();

    return res.status(201).json({
      message: "Firm added successfully",
      firm: savedFirm
    });

  } catch (error) {
    console.error("ADD FIRM ERROR:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

const getAllFirms = async (req, res) => {
  try {
    const firms = await Firm.find().populate('vendor');
    res.status(200).json(firms);
  } catch (error) {
    console.error("GET ALL FIRMS ERROR:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

module.exports = { addFirm, getAllFirms, upload };
