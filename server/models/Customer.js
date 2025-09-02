const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Customer name is required'],
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
        sparse: true, // Allows multiple documents to have null/undefined for this unique field
    },
    address: {
        type: String,
        required: [true, 'Address is required'],
        trim: true
    },
    location: {
        type: String,
        trim: true
    },
    creditAmount: {
        type: Number,
        default: 0,
        min: 0
    },
    rateType: {
        type: String,
        enum: ['Retail', 'Wholesale', 'Other', null],
        default: null
    },
    creditLimitAmount: {
        type: Number,
        default: 0,
        min: 0
    },
    creditLimitDays: {
        type: Number,
        default: 0,
        min: 0
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

customerSchema.index({ mobileNumber: 1 }); // Index for faster lookup

module.exports = mongoose.model('Customer', customerSchema);
