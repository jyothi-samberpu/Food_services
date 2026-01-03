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

    // create firm
    const firm = new Firm({
      firmname,
      area,
      category,
      region,
      offer,
      image,
      vendor: vendor._id
    });

    await firm.save();

    return res.status(200).json({
      message: "Firm added successfully",
      firm
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { addFirm: [upload.single('image'), addFirm] };
