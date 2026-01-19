const mongoose = require('mongoose');

const firmSchema = new mongoose.Schema({
    firmname: {
        type: String,
        required: true,
        unique: true
    },
    area: {
        type: String,
        required: true
    },
    category: {
        type: [
            {
                type: String,
                enum: ['veg', 'non-veg']
            }
        ]
    },
    region: {   // fixed typo
        type: [
            {
                type: String,
                enum: ['south-indian', 'north-indian', 'chinese', 'bakery']
            }
        ]
    },
    offer: {
        type: String
    },
    image: {
        type: String  // make optional for now
    },
    vendor: {   // single vendor reference
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor',
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product'
    }
});

const Firm = mongoose.model('Firm', firmSchema);
module.exports = Firm;
