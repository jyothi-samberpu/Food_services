const Vendor =require('../models/Vendor');
const jwt =require('jsonwebtoken');
const bcrypt =require('bcryptjs');
const dotEnv =require('dotenv');
const { vendorRegisterSchema, vendorLoginSchema } = require('../validations/schemas');
const handleError = require('../utils/errorHandler');

dotEnv.config();

const secretKey=process.env.WHATISYOURWORK

const vendorRegister=async(req,res)=>{
    try{
        // ✅ Validate input
        const { error, value } = vendorRegisterSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ 
                success: false,
                message: error.details[0].message 
            });
        }

        const {username, email, password} = value;

        const vendorEmail=await Vendor.findOne({email});
        if (vendorEmail){
            return res.status(400).json({
                success: false,
                message: "Email already registered"
            });
        }
        const hashedPassword =await bcrypt.hash(password,10);

        const newVendor = new Vendor({
            username,
            email,
            password:hashedPassword
        });
        await newVendor.save();
        res.status(201).json({
            success: true,
            message:"Vendor registered successfully"
        });
        console.log('Registered:', email)

    }catch(error){
        handleError(res, 500, 'Registration failed', error);
    }
}

const vendorLogin = async(req,res)=>{
    try{
        // ✅ Validate input
        const { error, value } = vendorLoginSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ 
                success: false,
                message: error.details[0].message 
            });
        }

        const {email,password} = value;

        const vendor=await Vendor.findOne({email});
        if(!vendor || !(await bcrypt.compare(password,vendor.password))){
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            })
        }

        const token = jwt.sign(
          { vendorId: vendor._id },
          secretKey,
          { expiresIn: "1h" }
        );

        res.status(200).json({
            success: true,
            message: "Login successful",
            token
        })
        console.log(email,"- Login successful");

    }catch(error){
        handleError(res, 500, 'Login failed', error);
    }
}

const getAllVendors= async(req,res)=>{
    try{
        const vendors = await Vendor.find().populate('firm')
        res.json({
            success: true,
            vendors
        })
    }catch(error){
        handleError(res, 500, 'Failed to fetch vendors', error);
    }
}

const getVendorById = async(req,res)=>{
    const vendorId = req.params.id;
    try{
        const vendor = await Vendor.findById(vendorId);
        if(!vendor){
            return res.status(404).json({
                success: false,
                message:"Vendor not found"
            })
        }
        res.status(200).json({
            success: true,
            vendor
        })
    }catch(error){
        handleError(res, 500, 'Failed to fetch vendor', error);
    }
}

module.exports={vendorRegister, vendorLogin,getAllVendors,getVendorById}