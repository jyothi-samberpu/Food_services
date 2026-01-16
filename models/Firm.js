
const mongoose = require('mongoose');

const firmSchema = new mongoose.Schema({
    firmname: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    area: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: [
            {
                type: String,
                enum: ['veg', 'non-veg']
            }
        ],
        required: true
    },
    region: {
        type: [
            {
                type: String,
                enum: ['south-indian', 'north-indian', 'chinese', 'bakery']
            }
        ]
    },
    offer: {
        type: String,
        trim: true
    },
    image: {
        type: String,
        required: true
    },
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor',
        required: true
    },
    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        }
    ]
}, { timestamps: true });

// Create indexes for better query performance
firmSchema.index({ vendor: 1 });
firmSchema.index({ area: 1 });

const Firm = mongoose.model('Firm', firmSchema);

module.exports = Firm;