const mongoose = require('mongoose');

// Item tracking schema for rack occupancy
const rackItemSchema = new mongoose.Schema({
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        required: true
    },
    itemName: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 0
    },
    reservedQuantity: {
        type: Number,
        default: 0,
        min: 0
    },
    purchaseId: {
        type: String,
        ref: 'Purchase'
    },
    assignedDate: {
        type: Date,
        default: Date.now
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, { _id: true });

// Zone/Section within rack
const rackZoneSchema = new mongoose.Schema({
    zoneName: {
        type: String,
        required: true,
        trim: true
    },
    zoneCode: {
        type: String,
        required: true,
        uppercase: true,
        trim: true
    },
    capacity: {
        type: Number,
        default: 0,
        min: 0
    },
    currentOccupancy: {
        type: Number,
        default: 0,
        min: 0
    },
    items: [rackItemSchema],
    isActive: {
        type: Boolean,
        default: true
    }
}, { _id: true });

const rackSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Rack name is required'],
        trim: true,
        maxlength: [50, 'Rack name cannot exceed 50 characters']
    },
    code: {
        type: String,
        required: [true, 'Rack code is required'],
        unique: true,
        uppercase: true,
        trim: true
    },
    location: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true,
        maxlength: [200, 'Description cannot exceed 200 characters']
    },

    // Enhanced capacity management
    capacity: {
        type: Number,
        default: 0,
        min: 0
    },
    currentOccupancy: {
        type: Number,
        default: 0,
        min: 0
    },
    reservedSpace: {
        type: Number,
        default: 0,
        min: 0
    },

    // Rack type and categorization
    rackType: {
        type: String,
        enum: ['Storage', 'Display', 'Freezer', 'Dry Storage', 'Liquid Storage', 'General'],
        default: 'General'
    },
    category: {
        type: String,
        enum: ['Food Items', 'Beverages', 'Frozen', 'Dairy', 'Vegetables', 'Fruits', 'Dry Goods', 'General'],
        default: 'General'
    },

    // Physical properties
    dimensions: {
        length: { type: Number, default: 0 },
        width: { type: Number, default: 0 },
        height: { type: Number, default: 0 },
        unit: { type: String, default: 'cm' }
    },

    // Temperature control (for food storage)
    temperatureControl: {
        hasTemperatureControl: { type: Boolean, default: false },
        minTemperature: { type: Number },
        maxTemperature: { type: Number },
        currentTemperature: { type: Number }
    },

    // Zone management for large racks
    zones: [rackZoneSchema],

    // Item tracking
    items: [rackItemSchema],

    // Access control
    accessLevel: {
        type: String,
        enum: ['Public', 'Restricted', 'Admin Only'],
        default: 'Public'
    },

    // Maintenance tracking
    maintenanceSchedule: {
        lastMaintenance: Date,
        nextMaintenance: Date,
        maintenanceNotes: String
    },

    // Status flags
    isActive: {
        type: Boolean,
        default: true
    },
    isUnderMaintenance: {
        type: Boolean,
        default: false
    },
    isReserved: {
        type: Boolean,
        default: false
    },

    // Store and user tracking
    store: {
        type: String,
        required: true,
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
    },

    // Purchase integration
    lastStockEntry: {
        purchaseId: String,
        date: Date,
        quantity: Number
    },

    // Notifications and alerts
    alerts: {
        lowStock: {
            enabled: { type: Boolean, default: false },
            threshold: { type: Number, default: 10 }
        },
        overCapacity: {
            enabled: { type: Boolean, default: true },
            threshold: { type: Number, default: 90 } // percentage
        },
        temperatureAlert: {
            enabled: { type: Boolean, default: false },
            minThreshold: Number,
            maxThreshold: Number
        }
    }
}, {
    timestamps: true
});

// Compound indexes for better performance
rackSchema.index({ code: 1, store: 1 }, { unique: true });
rackSchema.index({ location: 1, store: 1 });
rackSchema.index({ store: 1, isActive: 1 });
rackSchema.index({ rackType: 1, category: 1 });
rackSchema.index({ 'items.item': 1 });
rackSchema.index({ 'items.purchaseId': 1 });

// Virtual for available space
rackSchema.virtual('availableSpace').get(function() {
    return Math.max(0, this.capacity - this.currentOccupancy - this.reservedSpace);
});

// Virtual for occupancy percentage
rackSchema.virtual('occupancyPercentage').get(function() {
    if (this.capacity === 0) return 0;
    return Math.round(((this.currentOccupancy + this.reservedSpace) / this.capacity) * 100);
});

// Virtual for total items count
rackSchema.virtual('totalItems').get(function() {
    return this.items.reduce((total, item) => total + item.quantity, 0);
});

// Virtual for zone count
rackSchema.virtual('zoneCount').get(function() {
    return this.zones.length;
});

// Virtual for active zones
rackSchema.virtual('activeZones').get(function() {
    return this.zones.filter(zone => zone.isActive);
});

// Instance method to check if rack can accommodate quantity
rackSchema.methods.canAccommodate = function(quantity) {
    return this.availableSpace >= quantity;
};

// Instance method to add item to rack
rackSchema.methods.addItem = function(itemData) {
    const existingItem = this.items.find(item =>
        item.item.toString() === itemData.item.toString() &&
        item.purchaseId === itemData.purchaseId
    );

    if (existingItem) {
        existingItem.quantity += itemData.quantity;
        existingItem.lastUpdated = new Date();
    } else {
        this.items.push({
            ...itemData,
            assignedDate: new Date(),
            lastUpdated: new Date()
        });
    }

    this.currentOccupancy += itemData.quantity;
    this.lastStockEntry = {
        purchaseId: itemData.purchaseId,
        date: new Date(),
        quantity: itemData.quantity
    };
};

// Instance method to remove item from rack
rackSchema.methods.removeItem = function(itemId, quantity) {
    const item = this.items.find(item => item.item.toString() === itemId.toString());
    if (item && item.quantity >= quantity) {
        item.quantity -= quantity;
        item.lastUpdated = new Date();
        this.currentOccupancy -= quantity;

        // Remove item if quantity is 0
        if (item.quantity === 0) {
            this.items.pull(item._id);
        }
        return true;
    }
    return false;
};

// Instance method to reserve space
rackSchema.methods.reserveSpace = function(quantity) {
    if (this.availableSpace >= quantity) {
        this.reservedSpace += quantity;
        return true;
    }
    return false;
};

// Instance method to release reserved space
rackSchema.methods.releaseReservedSpace = function(quantity) {
    this.reservedSpace = Math.max(0, this.reservedSpace - quantity);
};

// Instance method to get items by purchase
rackSchema.methods.getItemsByPurchase = function(purchaseId) {
    return this.items.filter(item => item.purchaseId === purchaseId);
};

// Instance method to check alerts
rackSchema.methods.checkAlerts = function() {
    const alerts = [];

    // Check over capacity
    if (this.alerts.overCapacity.enabled) {
        const occupancyPercent = this.occupancyPercentage;
        if (occupancyPercent >= this.alerts.overCapacity.threshold) {
            alerts.push({
                type: 'overCapacity',
                message: `Rack ${this.code} is ${occupancyPercent}% full`,
                severity: occupancyPercent >= 100 ? 'critical' : 'warning'
            });
        }
    }

    // Check low stock (if enabled and applicable)
    if (this.alerts.lowStock.enabled && this.totalItems <= this.alerts.lowStock.threshold) {
        alerts.push({
            type: 'lowStock',
            message: `Rack ${this.code} has low stock: ${this.totalItems} items`,
            severity: 'info'
        });
    }

    // Check temperature (if applicable)
    if (this.temperatureControl.hasTemperatureControl && this.alerts.temperatureAlert.enabled) {
        const temp = this.temperatureControl.currentTemperature;
        const min = this.alerts.temperatureAlert.minThreshold;
        const max = this.alerts.temperatureAlert.maxThreshold;

        if (temp < min || temp > max) {
            alerts.push({
                type: 'temperature',
                message: `Rack ${this.code} temperature alert: ${temp}°C`,
                severity: 'critical'
            });
        }
    }

    return alerts;
};

// Static method to find racks by item
rackSchema.statics.findByItem = function(itemId) {
    return this.find({ 'items.item': itemId, isActive: true });
};

// Static method to find available racks
rackSchema.statics.findAvailableRacks = function(requiredSpace = 1, rackType = null, category = null) {
    const query = {
        isActive: true,
        isUnderMaintenance: false,
        $expr: { $gte: ['$availableSpace', requiredSpace] }
    };

    if (rackType) query.rackType = rackType;
    if (category) query.category = category;

    return this.find(query);
};

// Pre-save middleware to update occupancy and validate
rackSchema.pre('save', function(next) {
    // Update current occupancy based on items
    if (this.items && this.items.length > 0) {
        this.currentOccupancy = this.items.reduce((total, item) => total + item.quantity, 0);
    }

    // Validate capacity constraints
    if (this.currentOccupancy + this.reservedSpace > this.capacity && this.capacity > 0) {
        return next(new Error('Total occupancy exceeds rack capacity'));
    }

    // Update zones occupancy
    if (this.zones && this.zones.length > 0) {
        this.zones.forEach(zone => {
            zone.currentOccupancy = zone.items.reduce((total, item) => total + item.quantity, 0);
        });
    }

    next();
});

// Post-save middleware for logging
rackSchema.post('save', function() {
    // Log significant changes (optional)
    if (this.isModified('currentOccupancy')) {
        console.log(`Rack ${this.code} occupancy updated: ${this.currentOccupancy}/${this.capacity}`);
    }
});

// Ensure virtual fields are serialized
rackSchema.set('toJSON', { virtuals: true });
rackSchema.set('toObject', { virtuals: true });

// Transform function to clean up output
rackSchema.set('toJSON', {
    virtuals: true,
    transform: function(doc, ret) {
        delete ret.__v;
        return ret;
    }
});

module.exports = mongoose.models.Rack || mongoose.model('Rack', rackSchema);