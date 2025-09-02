const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const otpGenerator = require('otp-generator');

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
        required: [true, 'Please provide a role'],
        validate: {
            validator: async function(roleName) {
                const Role = require('./Role'); // Adjust path as needed
                const role = await Role.findOne({ 
                    roleName: roleName, 
                    isActive: true 
                });
                return !!role;
            },
            message: 'Invalid or inactive role specified'
        }
    },
    mobile: {
        type: String,
        required: [true, 'Please provide a mobile number'],
        unique: true
    },
    permissions: [{
        type: String
        // Removed enum constraint to allow dynamic permissions from Role collection
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
    billType: {
        type: String,
        enum: ['GST', 'Non-GST'],
        default: 'GST'
    },
    otp: String,
    otpExpires: Date,
    isVerified: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Pre-save middleware to set permissions from role
userSchema.pre('save', async function(next) {
    // Only update permissions if role is modified or if it's a new user without custom permissions
    if ((this.isModified('role') || this.isNew) && (!this.permissions || this.permissions.length === 0)) {
        try {
            const Role = require('./Role'); // Adjust path as needed
            const roleDoc = await Role.findOne({ 
                roleName: this.role, 
                isActive: true 
            });
            
            if (roleDoc && roleDoc.permissions) {
                this.permissions = roleDoc.permissions;
            } else {
                // Fallback to empty permissions if role not found or has no permissions
                this.permissions = [];
            }
        } catch (error) {
            console.error('Error fetching role permissions:', error);
            // Don't fail the save, just set empty permissions
            this.permissions = [];
        }
    }
    next();
});

// Method to sync permissions with role
userSchema.methods.syncPermissionsWithRole = async function() {
    try {
        const Role = require('./Role'); // Adjust path as needed
        const roleDoc = await Role.findOne({ 
            roleName: this.role, 
            isActive: true 
        });
        
        if (roleDoc && roleDoc.permissions) {
            this.permissions = roleDoc.permissions;
            return await this.save({ validateBeforeSave: false });
        }
        return this;
    } catch (error) {
        console.error('Error syncing permissions with role:', error);
        throw error;
    }
};

// Method to check if user has specific permission
userSchema.methods.hasPermission = function(permission) {
    return this.permissions && this.permissions.includes(permission);
};

// Method to add permission
userSchema.methods.addPermission = function(permission) {
    if (!this.permissions) {
        this.permissions = [];
    }
    if (!this.permissions.includes(permission)) {
        this.permissions.push(permission);
    }
    return this;
};

// Method to remove permission
userSchema.methods.removePermission = function(permission) {
    if (this.permissions) {
        this.permissions = this.permissions.filter(p => p !== permission);
    }
    return this;
};

userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.getSignedJwtToken = function() {
    return jwt.sign(
        { 
            id: this._id, 
            role: this.role,
            permissions: this.permissions 
        }, 
        process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

userSchema.methods.getRefreshToken = function() {
    const refreshToken = jwt.sign({ id: this._id }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: process.env.JWT_REFRESH_EXPIRE
    });

    this.refreshToken = refreshToken;
    return refreshToken;
};

userSchema.methods.generateOtp = function() {
    const otp = otpGenerator.generate(6, { 
        upperCaseAlphabets: false, 
        specialChars: false, 
        lowerCaseAlphabets: false 
    });
    this.otp = otp;
    this.otpExpires = Date.now() + 10 * 60 * 1000;
    return otp;
};

// Virtual to populate role details
userSchema.virtual('roleDetails', {
    ref: 'Role',
    localField: 'role',
    foreignField: 'roleName',
    justOne: true
});

// Ensure virtual fields are serialized
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

// Static method to get users by role
userSchema.statics.findByRole = function(roleName, options = {}) {
    return this.find({ role: roleName, ...options });
};

// Static method to get active users by role
userSchema.statics.findActiveByRole = function(roleName) {
    return this.find({ role: roleName, isActive: true });
};

// This line is the key fix. It checks if the model already exists before compiling.
module.exports = mongoose.models.User || mongoose.model('User', userSchema);