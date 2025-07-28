// models/User.js (Update this file)

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        trim: true,
        maxlength: [50, 'Name cannot be more than 50 characters']
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        lowercase: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            'Please provide a valid email'
        ]
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false
    },
    role: {
        type: String,
        enum: ['admin', 'manager', 'cashier'],
        default: 'cashier'
    },
    mobile: {
        type: String,
        required: [true, 'Please provide a mobile number'],
        unique: true
    },
    permissions: [{
        type: String,
        enum: [
            'dashboard.view',
            'sales.create', 'sales.view', 'sales.update', 'sales.delete',
            'purchase.create', 'purchase.view', 'purchase.update', 'purchase.delete',
            'inventory.create', 'inventory.view', 'inventory.update', 'inventory.delete',
            'recipe.create', 'recipe.view', 'recipe.update', 'recipe.delete',
            'party.create', 'party.view', 'party.update', 'party.delete',
            'expense.create', 'expense.view', 'expense.update', 'expense.delete',
            'offers.create', 'offers.view', 'offers.update', 'offers.delete',
            'items.create', 'items.view', 'items.update', 'items.delete',
            'reports.view',
            'users.create', 'users.view', 'users.update', 'users.delete',
            'kot.create', 'kot.view', 'kot.update'
        ]
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    lastLogin: {
        type: Date
    },
    refreshToken: {
        type: String,
        select: false
    },
    store: {
        type: String,
        default: 'MG Food Court'
    },
    // --- NEW FIELDS FOR OTP VERIFICATION ---
    otp: String, // Store the OTP
    otpExpires: Date, // Store the expiry time for the OTP
    isVerified: { // Flag to check if email is verified
        type: Boolean,
        default: false
    }
    // --- END NEW FIELDS ---
}, {
    timestamps: true
});

// Encrypt password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Set default permissions based on role
userSchema.pre('save', function(next) {
    if (this.isModified('role') || this.isNew) {
        switch (this.role) {
            case 'admin':
                this.permissions = [
                    'dashboard.view',
                    'sales.create', 'sales.view', 'sales.update', 'sales.delete',
                    'purchase.create', 'purchase.view', 'purchase.update', 'purchase.delete',
                    'inventory.create', 'inventory.view', 'inventory.update', 'inventory.delete',
                    'recipe.create', 'recipe.view', 'recipe.update', 'recipe.delete',
                    'party.create', 'party.view', 'party.update', 'party.delete',
                    'expense.create', 'expense.view', 'expense.update', 'expense.delete',
                    'offers.create', 'offers.view', 'offers.update', 'offers.delete',
                    'items.create', 'items.view', 'items.update', 'items.delete',
                    'reports.view',
                    'users.create', 'users.view', 'users.update', 'users.delete',
                    'kot.create', 'kot.view', 'kot.update'
                ];
                break;
            case 'manager':
                this.permissions = [
                    'dashboard.view',
                    'sales.create', 'sales.view', 'sales.update',
                    'purchase.view', 'purchase.update',
                    'inventory.view', 'inventory.update',
                    'recipe.view', 'recipe.update',
                    'party.view', 'party.update',
                    'expense.view',
                    'offers.view',
                    'items.view', 'items.update',
                    'reports.view',
                    'kot.create', 'kot.view', 'kot.update'
                ];
                break;
            case 'cashier':
                this.permissions = [
                    'dashboard.view',
                    'sales.create', 'sales.view',
                    'inventory.view',
                    'party.view',
                    'items.view',
                    'kot.create', 'kot.view', 'kot.update'
                ];
                break;
        }
    }
    next();
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Sign JWT and return
userSchema.methods.getSignedJwtToken = function() {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

// Generate refresh token
userSchema.methods.getRefreshToken = function() {
    const refreshToken = jwt.sign({ id: this._id }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: process.env.JWT_REFRESH_EXPIRE
    });

    this.refreshToken = refreshToken;
    return refreshToken;
};

// --- NEW METHOD FOR GENERATING OTP ---
userSchema.methods.generateOtp = function() {
    const otpGenerator = require('otp-generator');
    const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });

    // Set OTP and expiry (e.g., 10 minutes from now)
    this.otp = otp;
    this.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    return otp;
};
// --- END NEW METHOD ---

module.exports = mongoose.model('User', userSchema);