const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Vendor name is required'],
        trim: true,
        maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
        type: String,
        lowercase: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            'Please provide a valid email'
        ]
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required']
    },
    alternatePhone: {
        type: String
    },
    address: {
        street: String,
        city: String,
        state: String,
        pincode: String,
        country: { type: String, default: 'India' }
    },
    gstNumber: {
        type: String,
        uppercase: true
    },
    panNumber: {
        type: String,
        uppercase: true
    },
    contactPerson: {
        type: String,
        trim: true
    },
    paymentTerms: {
        type: String,
        enum: ['Cash', 'Credit', '15 Days', '30 Days', '45 Days', '60 Days', '90 Days'],
        default: 'Cash'
    },
    creditLimit: {
        type: Number,
        default: 0,
        min: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
    notes: {
        type: String,
        maxlength: [500, 'Notes cannot exceed 500 characters']
    },
    store: {
        type: String,
        default: 'MG Food Court'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

// Index for better performance
vendorSchema.index({ name: 1, store: 1 });
vendorSchema.index({ phone: 1 });
vendorSchema.index({ isActive: 1 });

module.exports = mongoose.models.Vendor || mongoose.model('Vendor', vendorSchema);