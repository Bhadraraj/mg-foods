// controllers/kotController.js
const asyncHandler = require('express-async-handler');
const KOT = require('../models/kotModel');
const Item = require('../models/itemModel');
const mongoose = require('mongoose');

// Create a new KOT
const createKOT = asyncHandler(async (req, res) => {
    try {
        const { tableNumber, orderReference, items, customerDetails, kotType, notes } = req.body;

        if (!req.user || !req.user._id) {
            return res.status(401).json({
                success: false,
                message: 'User not authorized or not found.'
            });
        }

        // Validate required fields
        if (!tableNumber || !items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Table number and items are required'
            });
        }

        // Validate items and calculate totals
        const validatedItems = [];
        for (const item of items) {
            if (!item.item || !item.quantity || !item.price) {
                return res.status(400).json({
                    success: false,
                    message: 'Each item must have item ID, quantity, and price'
                });
            }

            // Verify item exists
            const existingItem = await Item.findById(item.item);
            if (!existingItem) {
                return res.status(400).json({
                    success: false,
                    message: `Item with ID ${item.item} not found`
                });
            }

            validatedItems.push({
                item: item.item,
                itemName: item.itemName || existingItem.productName,
                quantity: parseInt(item.quantity),
                price: parseFloat(item.price),
                totalAmount: parseInt(item.quantity) * parseFloat(item.price),
                variant: item.variant,
                kotNote: item.kotNote,
                status: 'pending'
            });
        }

        // Generate KOT number
        const kotNumber = await KOT.generateKotNumber();

        // Calculate total amount
        const totalAmount = validatedItems.reduce((sum, item) => sum + item.totalAmount, 0);

        // Create KOT
        const newKOT = await KOT.create({
            kotNumber,
            tableNumber,
            orderReference,
            items: validatedItems,
            customerDetails: customerDetails || {},
            kotType: kotType || 'Tea Shop (KOT1)',
            totalAmount,
            notes,
            user: req.user._id
        });

        // Populate the created KOT
        const populatedKOT = await KOT.findById(newKOT._id)
            .populate('items.item', 'productName category')
            .populate('user', 'name email');

        res.status(201).json({
            success: true,
            message: 'KOT created successfully',
            data: populatedKOT
        });

    } catch (error) {
        console.error('Create KOT error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create KOT',
            error: error.message
        });
    }
});

// Get all KOTs with filtering and pagination
const getKOTs = asyncHandler(async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        // Build filter
        const filter = { user: req.user._id };

        // Filter by status
        if (req.query.status) {
            filter.status = req.query.status;
        }

        // Filter by KOT type
        if (req.query.kotType) {
            filter.kotType = req.query.kotType;
        }

        // Filter by table number
        if (req.query.tableNumber) {
            filter.tableNumber = { $regex: req.query.tableNumber, $options: 'i' };
        }

        // Filter by date range
        if (req.query.startDate || req.query.endDate) {
            filter.createdAt = {};
            if (req.query.startDate) {
                filter.createdAt.$gte = new Date(req.query.startDate);
            }
            if (req.query.endDate) {
                filter.createdAt.$lte = new Date(req.query.endDate);
            }
        }

        // Search by KOT number or customer name
        if (req.query.search) {
            filter.$or = [
                { kotNumber: { $regex: req.query.search, $options: 'i' } },
                { 'customerDetails.name': { $regex: req.query.search, $options: 'i' } }
            ];
        }

        const kots = await KOT.find(filter)
            .populate('items.item', 'productName category')
            .populate('user', 'name email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await KOT.countDocuments(filter);

        res.status(200).json({
            success: true,
            count: kots.length,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            },
            data: { kots }
        });

    } catch (error) {
        console.error('Get KOTs error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching KOTs',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Get KOT by ID
const getKOTById = asyncHandler(async (req, res) => {
    try {
        const kot = await KOT.findById(req.params.id)
            .populate('items.item', 'productName category brand')
            .populate('user', 'name email');

        if (!kot) {
            return res.status(404).json({
                success: false,
                message: 'KOT not found'
            });
        }

        if (kot.user._id.toString() !== req.user._id.toString()) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to view this KOT'
            });
        }

        res.status(200).json({
            success: true,
            data: kot
        });

    } catch (error) {
        console.error('Get KOT by ID error:', error);
        
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid KOT ID format'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to fetch KOT',
            error: error.message
        });
    }
});

// Update KOT
const updateKOT = asyncHandler(async (req, res) => {
    try {
        const kot = await KOT.findById(req.params.id);

        if (!kot) {
            return res.status(404).json({
                success: false,
                message: 'KOT not found'
            });
        }

        if (kot.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to update this KOT'
            });
        }

        let updateData = { ...req.body };

        // If updating items, validate them
        if (updateData.items) {
            const validatedItems = [];
            for (const item of updateData.items) {
                if (item.item && item.quantity && item.price) {
                    validatedItems.push({
                        ...item,
                        totalAmount: parseInt(item.quantity) * parseFloat(item.price)
                    });
                }
            }
            updateData.items = validatedItems;
            updateData.totalAmount = validatedItems.reduce((sum, item) => sum + item.totalAmount, 0);
        }

        const updatedKOT = await KOT.findByIdAndUpdate(
            req.params.id,
            updateData,
            {
                new: true,
                runValidators: true
            }
        ).populate('items.item', 'productName category')
         .populate('user', 'name email');

        res.status(200).json({
            success: true,
            message: 'KOT updated successfully',
            data: updatedKOT
        });

    } catch (error) {
        console.error('Update KOT error:', error);
        
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid KOT ID format'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to update KOT',
            error: error.message
        });
    }
});

// Update KOT item status
const updateKOTItemStatus = asyncHandler(async (req, res) => {
    try {
        const { kotId, itemId } = req.params;
        const { status } = req.body;

        if (!['pending', 'preparing', 'ready', 'served', 'cancelled'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status. Must be one of: pending, preparing, ready, served, cancelled'
            });
        }

        const kot = await KOT.findById(kotId);

        if (!kot) {
            return res.status(404).json({
                success: false,
                message: 'KOT not found'
            });
        }

        if (kot.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to update this KOT'
            });
        }

        // Find and update the specific item
        const itemIndex = kot.items.findIndex(item => item._id.toString() === itemId);
        
        if (itemIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Item not found in KOT'
            });
        }

        kot.items[itemIndex].status = status;
        
        // Set timestamps based on status
        if (status === 'ready') {
            kot.items[itemIndex].preparedAt = new Date();
        } else if (status === 'served') {
            kot.items[itemIndex].servedAt = new Date();
        }

        // Check if all items are served to mark KOT as completed
        const allItemsServed = kot.items.every(item => item.status === 'served' || item.status === 'cancelled');
        if (allItemsServed && kot.status === 'active') {
            kot.status = 'completed';
            kot.completedAt = new Date();
        }

        await kot.save();

        const updatedKOT = await KOT.findById(kotId)
            .populate('items.item', 'productName category')
            .populate('user', 'name email');

        res.status(200).json({
            success: true,
            message: 'KOT item status updated successfully',
            data: updatedKOT
        });

    } catch (error) {
        console.error('Update KOT item status error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update KOT item status',
            error: error.message
        });
    }
});

// Mark KOT as printed
const markKOTPrinted = asyncHandler(async (req, res) => {
    try {
        const kot = await KOT.findById(req.params.id);

        if (!kot) {
            return res.status(404).json({
                success: false,
                message: 'KOT not found'
            });
        }

        if (kot.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to update this KOT'
            });
        }

        kot.printedAt = new Date();
        await kot.save();

        res.status(200).json({
            success: true,
            message: 'KOT marked as printed',
            data: kot
        });

    } catch (error) {
        console.error('Mark KOT printed error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to mark KOT as printed',
            error: error.message
        });
    }
});

// Delete KOT
const deleteKOT = asyncHandler(async (req, res) => {
    try {
        const kot = await KOT.findById(req.params.id);

        if (!kot) {
            return res.status(404).json({
                success: false,
                message: 'KOT not found'
            });
        }

        if (kot.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to delete this KOT'
            });
        }

        await KOT.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'KOT deleted successfully'
        });

    } catch (error) {
        console.error('Delete KOT error:', error);
        
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid KOT ID format'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to delete KOT',
            error: error.message
        });
    }
});

// Get KOT statistics
const getKOTStats = asyncHandler(async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const stats = await KOT.aggregate([
            {
                $match: {
                    user: req.user._id,
                    createdAt: { $gte: today, $lt: tomorrow }
                }
            },
            {
                $group: {
                    _id: null,
                    totalKOTs: { $sum: 1 },
                    activeKOTs: {
                        $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
                    },
                    completedKOTs: {
                        $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
                    },
                    totalAmount: { $sum: '$totalAmount' },
                    avgOrderValue: { $avg: '$totalAmount' }
                }
            }
        ]);

        const kotStats = stats[0] || {
            totalKOTs: 0,
            activeKOTs: 0,
            completedKOTs: 0,
            totalAmount: 0,
            avgOrderValue: 0
        };

        // Get KOT type breakdown
        const kotTypeStats = await KOT.aggregate([
            {
                $match: {
                    user: req.user._id,
                    createdAt: { $gte: today, $lt: tomorrow }
                }
            },
            {
                $group: {
                    _id: '$kotType',
                    count: { $sum: 1 },
                    totalAmount: { $sum: '$totalAmount' }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: {
                overview: kotStats,
                kotTypeBreakdown: kotTypeStats
            }
        });

    } catch (error) {
        console.error('Get KOT stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch KOT statistics',
            error: error.message
        });
    }
});

// Get active KOTs for kitchen display
const getActiveKOTs = asyncHandler(async (req, res) => {
    try {
        const activeKOTs = await KOT.find({
            user: req.user._id,
            status: 'active'
        })
        .populate('items.item', 'productName category')
        .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: activeKOTs.length,
            data: { kots: activeKOTs }
        });

    } catch (error) {
        console.error('Get active KOTs error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch active KOTs',
            error: error.message
        });
    }
});

// Complete entire KOT
const completeKOT = asyncHandler(async (req, res) => {
    try {
        const kot = await KOT.findById(req.params.id);

        if (!kot) {
            return res.status(404).json({
                success: false,
                message: 'KOT not found'
            });
        }

        if (kot.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to update this KOT'
            });
        }

        // Mark all items as served and KOT as completed
        kot.items.forEach(item => {
            if (item.status !== 'cancelled') {
                item.status = 'served';
                item.servedAt = new Date();
            }
        });

        kot.status = 'completed';
        kot.completedAt = new Date();

        await kot.save();

        const updatedKOT = await KOT.findById(req.params.id)
            .populate('items.item', 'productName category')
            .populate('user', 'name email');

        res.status(200).json({
            success: true,
            message: 'KOT completed successfully',
            data: updatedKOT
        });

    } catch (error) {
        console.error('Complete KOT error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to complete KOT',
            error: error.message
        });
    }
});

module.exports = {
    createKOT,
    getKOTs,
    getKOTById,
    updateKOT,
    updateKOTItemStatus,
    markKOTPrinted,
    deleteKOT,
    getKOTStats,
    getActiveKOTs,
    completeKOT
};