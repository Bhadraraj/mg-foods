const mongoose = require('mongoose');

const labourAttendanceSchema = new mongoose.Schema({
    labourId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Labour', // Reference to the Labour model
        required: [true, 'Labour ID is required']
    },
    date: {
        type: Date,
        required: [true, 'Date is required'],
        // Ensure only one attendance record per labourer per day
        unique: true, // This will create a compound unique index with labourId
        index: true // Index for faster date queries
    },
    status: {
        type: String,
        enum: ['Present', 'Absent', 'Half-day', 'Leave'],
        required: [true, 'Attendance status is required'],
        default: 'Absent'
    },
    clockInTime: {
        type: String, // Storing as string "HH:MM"
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please use HH:MM format (24-hour)']
    },
    clockOutTime: {
        type: String, // Storing as string "HH:MM"
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please use HH:MM format (24-hour)']
    },
    notes: {
        type: String,
        trim: true,
        maxlength: [250, 'Notes cannot be more than 250 characters']
    }
}, {
    timestamps: true // Adds createdAt and updatedAt
});

// Compound unique index to ensure one attendance record per labourer per day
labourAttendanceSchema.index({ labourId: 1, date: 1 }, { unique: true });

// Pre-save hook to set clock-in/out times based on status if not provided
labourAttendanceSchema.pre('save', function(next) {
    // If status is 'Absent' or 'Leave', ensure clock-in/out are null/undefined
    if (this.status === 'Absent' || this.status === 'Leave') {
        this.clockInTime = undefined;
        this.clockOutTime = undefined;
    }
    // If status is 'Present' or 'Half-day' and times are not set, set defaults
    if ((this.status === 'Present' || this.status === 'Half-day') && !this.clockInTime) {
        // You might want to set a default time or require it via validation
        // For now, we'll let validation handle missing required times if needed.
    }
    next();
});

module.exports = mongoose.model('LabourAttendance', labourAttendanceSchema);
