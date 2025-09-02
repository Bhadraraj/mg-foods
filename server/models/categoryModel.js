// models/categoryModel.js
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a category name'],
        trim: true,
        maxlength: [100, 'Category name cannot be more than 100 characters']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Description cannot be more than 500 characters']
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// FIXED: Virtual to get total items count dynamically
// The issue was with the match function - it needs to be properly scoped
categorySchema.virtual('totalItems', {
    ref: 'Item',
    localField: 'name',
    foreignField: 'category',
    count: true,
    match: function(doc) {
        // Use doc parameter to access the category document
        return { user: doc.user };
    }
});

// Alternative virtual with better error handling
categorySchema.virtual('itemCount', {
    ref: 'Item',
    localField: 'name',
    foreignField: 'category',
    count: true
});

// Method to get items count for this category
categorySchema.methods.getItemCount = async function() {
    try {
        const Item = mongoose.model('Item');
        const count = await Item.countDocuments({
            category: this.name,
            user: this.user
        });
        return count;
    } catch (error) {
        console.error('Error getting item count for category:', this.name, error);
        return 0;
    }
};

// Method to get all items in this category
categorySchema.methods.getItems = async function() {
    try {
        const Item = mongoose.model('Item');
        const items = await Item.find({
            category: this.name,
            user: this.user
        }).select('productName brandName subCategory stockDetails priceDetails');
        return items;
    } catch (error) {
        console.error('Error getting items for category:', this.name, error);
        return [];
    }
};

// Compound index for user and category name uniqueness
categorySchema.index({ user: 1, name: 1 }, { unique: true });

// Pre-save middleware to ensure category name is unique per user
categorySchema.pre('save', async function(next) {
    if (!this.isModified('name')) {
        return next();
    }

    try {
        const existingCategory = await mongoose.model('Category').findOne({
            name: { $regex: new RegExp(`^${this.name}$`, 'i') },
            user: this.user,
            _id: { $ne: this._id }
        });

        if (existingCategory) {
            const error = new Error('Category with this name already exists');
            error.status = 400;
            return next(error);
        }

        next();
    } catch (error) {
        next(error);
    }
});

// Pre-remove middleware to handle items when category is deleted
categorySchema.pre('remove', async function(next) {
    try {
        const Item = mongoose.model('Item');
        
        // Check if items exist before deletion
        const itemCount = await Item.countDocuments({ 
            category: this.name, 
            user: this.user 
        });
        
        if (itemCount > 0) {
            // Option 1: Remove category from items (set to null/undefined)
            await Item.updateMany(
                { category: this.name, user: this.user },
                { $unset: { category: 1 } }
            );
            console.log(`Removed category '${this.name}' from ${itemCount} items`);
        }
        
        // Option 2: If you want to prevent deletion when items exist, use this instead:
        /*
        if (itemCount > 0) {
            const error = new Error(`Cannot delete category. ${itemCount} items are still using this category.`);
            error.status = 400;
            return next(error);
        }
        */
        
        next();
    } catch (error) {
        console.error('Error in pre-remove middleware:', error);
        next(error);
    }
});

// Pre-deleteOne and Pre-findOneAndDelete middleware (for newer Mongoose versions)
categorySchema.pre(['deleteOne', 'findOneAndDelete'], async function(next) {
    try {
        const docToDelete = await this.model.findOne(this.getQuery());
        if (docToDelete) {
            const Item = mongoose.model('Item');
            const itemCount = await Item.countDocuments({ 
                category: docToDelete.name, 
                user: docToDelete.user 
            });
            
            if (itemCount > 0) {
                await Item.updateMany(
                    { category: docToDelete.name, user: docToDelete.user },
                    { $unset: { category: 1 } }
                );
                console.log(`Removed category '${docToDelete.name}' from ${itemCount} items`);
            }
        }
        next();
    } catch (error) {
        console.error('Error in pre-delete middleware:', error);
        next(error);
    }
});

// Static method to find categories with item counts
categorySchema.statics.findWithItemCounts = async function(filter = {}) {
    try {
        const categories = await this.find(filter)
            .populate('user', 'name email')
            .sort({ createdAt: -1 });

        const Item = mongoose.model('Item');
        
        const categoriesWithCounts = await Promise.all(
            categories.map(async (category) => {
                try {
                    const itemCount = await Item.countDocuments({
                        category: category.name,
                        user: category.user._id || category.user
                    });
                    
                    return {
                        ...category.toJSON(),
                        totalItems: itemCount
                    };
                } catch (error) {
                    console.error('Error counting items for category:', category.name, error);
                    return {
                        ...category.toJSON(),
                        totalItems: 0
                    };
                }
            })
        );

        return categoriesWithCounts;
    } catch (error) {
        console.error('Error in findWithItemCounts:', error);
        throw error;
    }
};

// Static method for paginated results with item counts
categorySchema.statics.findPaginatedWithCounts = async function(filter = {}, options = {}) {
    try {
        const { 
            page = 1, 
            limit = 20, 
            sort = { createdAt: -1 },
            populate = 'user'
        } = options;
        
        const skip = (page - 1) * limit;

        const categories = await this.find(filter)
            .populate(populate, 'name email')
            .sort(sort)
            .skip(skip)
            .limit(limit);

        const total = await this.countDocuments(filter);

        const Item = mongoose.model('Item');
        
        const categoriesWithCounts = await Promise.all(
            categories.map(async (category) => {
                try {
                    const itemCount = await Item.countDocuments({
                        category: category.name,
                        user: category.user._id || category.user
                    });
                    
                    return {
                        ...category.toJSON(),
                        totalItems: itemCount
                    };
                } catch (error) {
                    console.error('Error counting items for category:', category.name, error);
                    return {
                        ...category.toJSON(),
                        totalItems: 0
                    };
                }
            })
        );

        return {
            categories: categoriesWithCounts,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        };
    } catch (error) {
        console.error('Error in findPaginatedWithCounts:', error);
        throw error;
    }
};

module.exports = mongoose.model('Category', categorySchema);