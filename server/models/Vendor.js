const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Vendor name is required'],
        trim: true, 
    },
    mobileNumber: {
        type: String,
        required: [true, 'Mobile number is required'],
        unique: true,
        trim: true, 
    },
    gstNumber: {
        type: String,
        trim: true,
        uppercase: true,
        sparse: true
    },
    address: {
        type: String,
        required: [true, 'Address is required'],
        trim: true, 
    },
    location: {
        type: String,
        trim: true, 
    },
    vendorCode: {
        type: String,
        trim: true,
        unique: true,
        sparse: true, 
    },
    accountDetails: {
        accountName: { type: String, trim: true },
        accountBankName: { type: String, trim: true },
        branchName: { type: String, trim: true },
        accountNumber: { type: String, trim: true },
        accountIFSCCode: { type: String, trim: true },
        upiID: { type: String, trim: true }
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

vendorSchema.index({ mobileNumber: 1 }); // Index for faster lookup
vendorSchema.index({ vendorCode: 1 }, { unique: true, sparse: true }); // Index for unique vendor code

module.exports = mongoose.model('Vendor', vendorSchema);
