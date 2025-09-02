const Brand = require('../models/Brand');
const Item = require('../models/itemModel');
const asyncHandler = require('express-async-handler');

// @desc    Get all brands
// @route   GET /api/brands
// @access  Private (brand.view)
const getBrands = asyncHandler(async (req, res) => {
    const {
        page = 1,
        limit = 10,
        search = '',
        isActive,
        sortBy = 'createdAt',
        sortOrder = 'desc'
    } = req.query;

    // Build query
    let query = { store: req.user.store };

    // Search functionality
    if (search) {
        query.$or = [
            { name: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
        ];
    }

    // Filter by active status
    if (isActive !== undefined) {
        query.isActive = isActive === 'true';
    }

    // Calculate pagination
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const startIndex = (pageNum - 1) * limitNum;

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    try {
        const brands = await Brand.find(query)
            .populate('createdBy', 'name')
            .populate('updatedBy', 'name')
            .populate('itemCount')
            .sort(sort)
            .limit(limitNum)
            .skip(startIndex);

        const total = await Brand.countDocuments(query);

        res.status(200).json({
            success: true,
            data: brands,
            pagination: {
                current: pageNum,
                pages: Math.ceil(total / limitNum),
                total,
                limit: limitNum
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// @desc    Get single brand
// @route   GET /api/brands/:id
// @access  Private (brand.view)
const getBrandById = asyncHandler(async (req, res) => {
    try {
        const brand = await Brand.findById(req.params.id)
            .populate('createdBy', 'name')
            .populate('updatedBy', 'name')
            .populate('items', 'name price isActive');

        if (!brand) {
            return res.status(404).json({
                success: false,
                message: 'Brand not found'
            });
        }

        res.status(200).json({
            success: true,
            data: brand
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// @desc    Create new brand
// @route   POST /api/brands
// @access  Private (brand.create)
const createBrand = asyncHandler(async (req, res) => {
    try {
        const brandData = {
            ...req.body,
            store: req.user.store,
            createdBy: req.user._id
        };

        const brand = await Brand.create(brandData);

        const populatedBrand = await Brand.findById(brand._id)
            .populate('createdBy', 'name');

        res.status(201).json({
            success: true,
            data: populatedBrand,
            message: 'Brand created successfully'
        });
    } catch (error) {
        if (error.code === 11000) {
            res.status(400).json({
                success: false,
                message: 'Brand name already exists'
            });
        } else {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
});

// @desc    Update brand
// @route   PUT /api/brands/:id
// @access  Private (brand.update)
const updateBrand = asyncHandler(async (req, res) => {
    try {
        let brand = await Brand.findById(req.params.id);

        if (!brand) {
            return res.status(404).json({
                success: false,
                message: 'Brand not found'
            });
        }

        const updateData = {
            ...req.body,
            updatedBy: req.user._id
        };

        brand = await Brand.findByIdAndUpdate(
            req.params.id,
            updateData,
            {
                new: true,
                runValidators: true
            }
        ).populate('createdBy', 'name').populate('updatedBy', 'name');

        res.status(200).json({
            success: true,
            data: brand,
            message: 'Brand updated successfully'
        });
    } catch (error) {
        if (error.code === 11000) {
            res.status(400).json({
                success: false,
                message: 'Brand name already exists'
            });
        } else {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
});

// @desc    Delete brand
// @route   DELETE /api/brands/:id
// @access  Private (brand.delete)
const deleteBrand = asyncHandler(async (req, res) => {
    try {
        const brand = await Brand.findById(req.params.id);

        if (!brand) {
            return res.status(404).json({
                success: false,
                message: 'Brand not found'
            });
        }

        // Check if brand has associated items
        const itemCount = await Item.countDocuments({ brand: req.params.id });
        if (itemCount > 0) {
            return res.status(400).json({
                success: false,
                message: `Cannot delete brand. It has ${itemCount} associated items.`
            });
        }

        await Brand.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Brand deleted successfully'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// @desc    Get available items for brand assignment
// @route   GET /api/brands/available-items
// @access  Private (brand.view)
const getAvailableItems = asyncHandler(async (req, res) => {
    try {
        const items = await Item.find({
            store: req.user.store,
            isActive: true,
            $or: [
                { brand: { $exists: false } },
                { brand: null }
            ]
        }).select('name price category subCategory');

        res.status(200).json({
            success: true,
            data: items
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// @desc    Assign items to brand
// @route   POST /api/brands/:id/items
// @access  Private (brand.update)
const assignItemsToBrand = asyncHandler(async (req, res) => {
    const { itemIds } = req.body;

    if (!itemIds || !Array.isArray(itemIds) || itemIds.length === 0) {
        return res.status(400).json({
            success: false,
            message: 'Please provide valid item IDs array'
        });
    }

    try {
        const brand = await Brand.findById(req.params.id);
        if (!brand) {
            return res.status(404).json({
                success: false,
                message: 'Brand not found'
            });
        }

        // Update items to assign them to this brand
        await Item.updateMany(
            { _id: { $in: itemIds } },
            { brand: req.params.id }
        );

        // Add items to brand's items array (avoid duplicates)
        const uniqueItemIds = [...new Set([...brand.items, ...itemIds])];
        brand.items = uniqueItemIds;
        brand.updatedBy = req.user._id;
        await brand.save();

        res.status(200).json({
            success: true,
            message: `${itemIds.length} items assigned to brand successfully`
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// @desc    Remove items from brand
// @route   DELETE /api/brands/:id/items
// @access  Private (brand.update)
const removeItemsFromBrand = asyncHandler(async (req, res) => {
    const { itemIds } = req.body;

    if (!itemIds || !Array.isArray(itemIds) || itemIds.length === 0) {
        return res.status(400).json({
            success: false,
            message: 'Please provide valid item IDs array'
        });
    }

    try {
        const brand = await Brand.findById(req.params.id);
        if (!brand) {
            return res.status(404).json({
                success: false,
                message: 'Brand not found'
            });
        }

        // Remove brand reference from items
        await Item.updateMany(
            { _id: { $in: itemIds } },
            { $unset: { brand: 1 } }
        );

        // Remove items from brand's items array
        brand.items = brand.items.filter(itemId => !itemIds.includes(itemId.toString()));
        brand.updatedBy = req.user._id;
        await brand.save();

        res.status(200).json({
            success: true,
            message: `${itemIds.length} items removed from brand successfully`
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = {
    getBrands,
    getBrandById,
    createBrand,
    updateBrand,
    deleteBrand,
    getAvailableItems,
    assignItemsToBrand,
    removeItemsFromBrand
};