const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Table name is required'],
        trim: true,
        maxlength: [50, 'Table name cannot exceed 50 characters']
    },
    tableNumber: {
        type: String,
        required: [true, 'Table number is required'],
        trim: true,
        unique: true
    },
    capacity: {
        type: Number,
        default: 4,
        min: [1, 'Capacity must be at least 1'],
        max: [20, 'Capacity cannot exceed 20']
    },
    isOccupied: {
        type: Boolean,
        default: false
    },
    occupiedTime: {
        type: Date
    },
    totalAmount: {
        type: Number,
        default: 0,
        min: [0, 'Total amount cannot be negative']
    },
    elapsedMinutes: {
        type: Number,
        default: 0,
        min: [0, 'Elapsed minutes cannot be negative']
    },
    parentTable: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Table',
        default: null
    },
    childTables: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Table'
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    status: {
        type: String,
        enum: ['Available', 'Running', 'Bill Generated'],
        default: 'Available'
    },
    location: {
        type: String,
        trim: true,
        maxlength: [100, 'Location cannot exceed 100 characters']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [200, 'Description cannot exceed 200 characters']
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

// Indexes for better performance
tableSchema.index({ tableNumber: 1, store: 1 }, { unique: true });
tableSchema.index({ isActive: 1 });
tableSchema.index({ status: 1 });
tableSchema.index({ parentTable: 1 });

// Virtual for child table count
tableSchema.virtual('childTableCount', {
    ref: 'Table',
    localField: '_id',
    foreignField: 'parentTable',
    count: true
});

// Method to check if table is parent table
tableSchema.methods.isParentTable = function() {
    return this.parentTable === null;
};

// Method to get next child table number
tableSchema.statics.getNextChildTableNumber = async function(parentTableNumber) {
    const childTables = await this.find({
        parentTable: { $ne: null },
        tableNumber: { $regex: `^${parentTableNumber}-` }
    }).sort({ tableNumber: -1 });

    if (childTables.length === 0) {
        return `${parentTableNumber}-1`;
    }

    // Extract the highest child number
    const lastChildNumber = childTables[0].tableNumber.split('-')[1];
    const nextNumber = parseInt(lastChildNumber) + 1;
    
    return `${parentTableNumber}-${nextNumber}`;
};

// Pre-save middleware to handle table number validation
tableSchema.pre('save', async function(next) {
    if (this.isNew && this.parentTable) {
        // If this is a child table, ensure parent exists
        const parent = await this.constructor.findById(this.parentTable);
        if (!parent) {
            throw new Error('Parent table not found');
        }
        
        // Auto-generate child table number if not provided
        if (!this.tableNumber) {
            this.tableNumber = await this.constructor.getNextChildTableNumber(parent.tableNumber);
        }
    }
    next();
});

// Post-save middleware to update parent's child tables array
tableSchema.post('save', async function() {
    if (this.parentTable && this.isNew) {
        await this.constructor.findByIdAndUpdate(
            this.parentTable,
            { $addToSet: { childTables: this._id } }
        );
    }
});

// Pre-remove middleware to clean up references
tableSchema.pre('findOneAndDelete', async function() {
    const table = await this.model.findOne(this.getQuery());
    if (table) {
        // If deleting a parent table, also delete all child tables
        if (table.isParentTable() && table.childTables.length > 0) {
            await this.model.deleteMany({ _id: { $in: table.childTables } });
        }
        
        // If deleting a child table, remove from parent's childTables array
        if (table.parentTable) {
            await this.model.findByIdAndUpdate(
                table.parentTable,
                { $pull: { childTables: table._id } }
            );
        }
    }
});

// Ensure virtual fields are serialized
tableSchema.set('toJSON', { virtuals: true });
tableSchema.set('toObject', { virtuals: true });

module.exports = mongoose.models.Table || mongoose.model('Table', tableSchema);