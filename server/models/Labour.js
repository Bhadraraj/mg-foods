const mongoose = require('mongoose');

const labourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        maxlength: [50, 'Name cannot be more than 50 characters']
    },
    mobileNumber: { // <--- THIS MUST BE 'mobileNumber'
        type: String,
        required: [true, 'Mobile number is required'],
        unique: true,
        trim: true,
        match: [/^\d{10}$/, 'Please provide a valid 10-digit mobile number']
    },
    address: {
        type: String,
        required: [true, 'Address is required'],
        trim: true,
        maxlength: [200, 'Address cannot be more than 200 characters']
    },
    monthlySalary: {
        type: Number,
        required: [true, 'Monthly salary is required'],
        min: [0, 'Monthly salary cannot be negative']
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

labourSchema.index({ mobileNumber: 1 }); // Index for faster lookup

module.exports = mongoose.model('Labour', labourSchema);
