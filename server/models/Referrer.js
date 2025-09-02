const mongoose = require('mongoose');

const referrerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Referrer name is required'],
        trim: true,
        maxlength: [100, 'Referrer name cannot be more than 100 characters']
    },
    mobileNumber: {
        type: String,
        required: [true, 'Mobile number is required'],
        unique: true,
        trim: true,
        match: [/^\d{10}$/, 'Please provide a valid 10-digit mobile number']
    },
    gstNumber: {
        type: String,
        trim: true,
        uppercase: true,
        sparse: true,
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
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

referrerSchema.index({ mobileNumber: 1 }); // Index for faster lookup

module.exports = mongoose.model('Referrer', referrerSchema);
