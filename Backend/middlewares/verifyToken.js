const Vendor = require('../models/Vendor');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const secretKey = process.env.WHATISYOURWORK;

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: 'Access Denied: No Token Provided'
      });
    }

    // Expected format: Bearer <token>
    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        message: 'Access Denied: Token Missing'
      });
    }

    const decoded = jwt.verify(token, secretKey);

    // IMPORTANT: payload key must match token creation
    const vendor = await Vendor.findById(decoded.vendorId);

    if (!vendor) {
      return res.status(401).json({
        message: 'Access Denied: Invalid Token'
      });
    }

    req.vendorId = vendor._id;
    next();

  } catch (error) {
    console.log(error);
    return res.status(401).json({
      message: 'Access Denied: Invalid Token'
    });
  }
};

module.exports = verifyToken;