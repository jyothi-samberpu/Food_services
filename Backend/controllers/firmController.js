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
const addFirm = async (req, res) => {
  try {
    const { firmname, area, category, region, offer } = req.body;

    // get image name if uploaded
    const image = req.file ? req.file.filename : undefined;

    // find vendor
    const vendor = await Vendor.findById(req.vendorId);
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
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

    // create firm
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

    return res.status(200).json({
      message: "Firm added successfully",
      firm
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ---------- Get All Firms ---------- */
const getAllFirms = async (req, res) => {
  try {
    const firms = await Firm.find().populate('vendor', 'username email');
    res.status(200).json({ firms });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ---------- Get Firm by ID ---------- */
const getFirmById = async (req, res) => {
  try {
    const firm = await Firm.findById(req.params.id).populate('vendor', 'username email');
    if (!firm) {
      return res.status(404).json({ message: "Firm not found" });
    }
    res.status(200).json({ firm });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ---------- Delete Firm ---------- */
const deleteFirm = async (req, res) => {
  try {
    const firm = await Firm.findByIdAndDelete(req.params.id);
    if (!firm) {
      return res.status(404).json({ message: "Firm not found" });
    }
    res.status(200).json({ message: "Firm deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { 
  addFirm: [upload.single('image'), addFirm],
  getAllFirms,
  getFirmById,
  deleteFirm
};
