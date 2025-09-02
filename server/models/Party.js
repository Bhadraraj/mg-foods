const mongoose = require('mongoose');

const partySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Party name is required'],
        trim: true,
        maxlength: [100, 'Party name cannot be more than 100 characters']
    },
    type: {
        type: String,
        enum: ['customer', 'vendor', 'referrer'],
        required: [true, 'Party type is required']
    },
    mobileNumber: {
        type: String,
        required: [true, 'Mobile number is required'],
        unique: true, // Mobile numbers should be unique across all party types
        trim: true,
        match: [/^\d{10}$/, 'Please provide a valid 10-digit mobile number'] // Simple 10-digit check
    },
    gstNumber: {
        type: String,
        trim: true,
        uppercase: true,
        sparse: true, // Allows multiple documents to have null/undefined for this unique field
        match: [/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, 'Please provide a valid GST number']
    },
    address: {
        type: String,
        required: [true, 'Address is required'],
        trim: true,
        maxlength: [250, 'Address cannot be more than 250 characters']
    },
    location: {
        type: String,
        trim: true,
        maxlength: [100, 'Location cannot be more than 100 characters']
    },
    // Customer Specific Fields
    creditAmount: {
        type: Number,
        default: 0,
        min: 0
    },
    rateType: {
        type: String,
        enum: ['Retail', 'Wholesale', 'Other', null], // Add other types as needed
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
    // Vendor Specific Fields
    vendorCode: {
        type: String,
        trim: true,
        unique: true,
        sparse: true, // Allows multiple documents to have null/undefined for this unique field
        maxlength: [50, 'Vendor code cannot be more than 50 characters']
    },
    accountDetails: {
        accountName: { type: String, trim: true },
        accountBankName: { type: String, trim: true },
        branchName: { type: String, trim: true },
        accountNumber: { type: String, trim: true },
        accountIFSCCode: { type: String, trim: true },
        upiID: { type: String, trim: true }
    },
    // Referrer Specific Fields (already covered by name, mobileNumber, gstNumber, address)

    // Common fields for all types
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true // Adds createdAt and updatedAt timestamps
});

// Index for faster lookups on type and mobileNumber
partySchema.index({ type: 1, mobileNumber: 1 });

// The key line: This checks if the model exists before compiling it.
module.exports = mongoose.models.Party || mongoose.model('Party', partySchema);
