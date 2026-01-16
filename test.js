// Quick test script to debug the vendor registration
const mongoose = require('mongoose');
const Vendor = require('./models/Vendor');
require('dotenv').config();

async function testVendorModel() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URL);
        console.log('✓ MongoDB connected');

        // Test creating a vendor
        const testVendor = new Vendor({
            username: 'testvendor1',
            email: 'vendor1@test.com',
            password: 'hashedPassword123'
        });

        console.log('Testing Vendor model...');
        await testVendor.save();
        console.log('✓ Vendor created successfully:', testVendor);

        // Test finding vendor
        const found = await Vendor.findOne({ email: 'vendor1@test.com' });
        console.log('✓ Vendor found:', found);

        console.log('\n✓ All tests passed!');
        process.exit(0);
    } catch (error) {
        console.error('✗ Error:', error.message);
        process.exit(1);
    }
}

testVendorModel();
