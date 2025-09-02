const Ledger = require('../models/Ledger');
const asyncHandler = require('express-async-handler');

// @desc    Get all ledgers
// @route   GET /api/ledgers
// @access  Private (ledger.view)
const getLedgers = asyncHandler(async (req, res) => {
    const {
        page = 1,
        limit = 10,
        search = '',
        isActive,
        ledgerCategory,
        ledgerGroup,
        isTaxLedger,
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

    // Filter by ledger category
    if (ledgerCategory) {
        query.ledgerCategory = ledgerCategory;
    }

    // Filter by ledger group
    if (ledgerGroup) {
        query.ledgerGroup = ledgerGroup;
    }

    // Filter by tax ledger
    if (isTaxLedger !== undefined) {
        query.isTaxLedger = isTaxLedger === 'true';
    }

    // Calculate pagination
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const startIndex = (pageNum - 1) * limitNum;

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    try {
        const ledgers = await Ledger.find(query)
            .populate('createdBy', 'name')
            .populate('updatedBy', 'name')
            .sort(sort)
            .limit(limitNum)
            .skip(startIndex);

        const total = await Ledger.countDocuments(query);

        res.status(200).json({
            success: true,
            data: ledgers,
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

// @desc    Get single ledger
// @route   GET /api/ledgers/:id
// @access  Private (ledger.view)
const getLedgerById = asyncHandler(async (req, res) => {
    try {
        const ledger = await Ledger.findById(req.params.id)
            .populate('createdBy', 'name')
            .populate('updatedBy', 'name');

        if (!ledger) {
            return res.status(404).json({
                success: false,
                message: 'Ledger not found'
            });
        }

        // Check if ledger belongs to user's store
        if (ledger.store !== req.user.store) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        res.status(200).json({
            success: true,
            data: ledger
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// @desc    Create new ledger
// @route   POST /api/ledgers
// @access  Private (ledger.create)
const createLedger = asyncHandler(async (req, res) => {
    try {
        // Validate tax percentage if tax ledger
        if (req.body.isTaxLedger && (!req.body.taxPercentage || req.body.taxPercentage <= 0)) {
            return res.status(400).json({
                success: false,
                message: 'Tax percentage is required for tax ledgers'
            });
        }

        const ledgerData = {
            ...req.body,
            store: req.user.store,
            createdBy: req.user._id
        };

        const ledger = await Ledger.create(ledgerData);

        const populatedLedger = await Ledger.findById(ledger._id)
            .populate('createdBy', 'name');

        res.status(201).json({
            success: true,
            data: populatedLedger,
            message: 'Ledger created successfully'
        });
    } catch (error) {
        if (error.code === 11000) {
            res.status(400).json({
                success: false,
                message: 'Ledger name already exists in this store'
            });
        } else if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            res.status(400).json({
                success: false,
                message: errors.join(', ')
            });
        } else {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
});

// @desc    Update ledger
// @route   PUT /api/ledgers/:id
// @access  Private (ledger.update)
const updateLedger = asyncHandler(async (req, res) => {
    try {
        let ledger = await Ledger.findById(req.params.id);

        if (!ledger) {
            return res.status(404).json({
                success: false,
                message: 'Ledger not found'
            });
        }

        // Check if ledger belongs to user's store
        if (ledger.store !== req.user.store) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        // Validate tax percentage if tax ledger
        if (req.body.isTaxLedger && (!req.body.taxPercentage || req.body.taxPercentage <= 0)) {
            return res.status(400).json({
                success: false,
                message: 'Tax percentage is required for tax ledgers'
            });
        }

        const updateData = {
            ...req.body,
            updatedBy: req.user._id
        };

        ledger = await Ledger.findByIdAndUpdate(
            req.params.id,
            updateData,
            {
                new: true,
                runValidators: true
            }
        ).populate('createdBy', 'name').populate('updatedBy', 'name');

        res.status(200).json({
            success: true,
            data: ledger,
            message: 'Ledger updated successfully'
        });
    } catch (error) {
        if (error.code === 11000) {
            res.status(400).json({
                success: false,
                message: 'Ledger name already exists in this store'
            });
        } else if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            res.status(400).json({
                success: false,
                message: errors.join(', ')
            });
        } else {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
});

// @desc    Delete ledger
// @route   DELETE /api/ledgers/:id
// @access  Private (ledger.delete)
const deleteLedger = asyncHandler(async (req, res) => {
    try {
        const ledger = await Ledger.findById(req.params.id);

        if (!ledger) {
            return res.status(404).json({
                success: false,
                message: 'Ledger not found'
            });
        }

        // Check if ledger belongs to user's store
        if (ledger.store !== req.user.store) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        // Check if ledger has associated transactions (you would implement this check)
        // const transactionCount = await Transaction.countDocuments({ 
        //     $or: [{ debitLedger: req.params.id }, { creditLedger: req.params.id }] 
        // });
        // if (transactionCount > 0) {
        //     return res.status(400).json({
        //         success: false,
        //         message: `Cannot delete ledger. It has ${transactionCount} associated transactions.`
        //     });
        // }

        await Ledger.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Ledger deleted successfully'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// @desc    Toggle ledger status (active/inactive)
// @route   PATCH /api/ledgers/:id/toggle-status
// @access  Private (ledger.update)
const toggleLedgerStatus = asyncHandler(async (req, res) => {
    try {
        const ledger = await Ledger.findById(req.params.id);

        if (!ledger) {
            return res.status(404).json({
                success: false,
                message: 'Ledger not found'
            });
        }

        // Check if ledger belongs to user's store
        if (ledger.store !== req.user.store) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        ledger.isActive = !ledger.isActive;
        ledger.updatedBy = req.user._id;
        await ledger.save();

        res.status(200).json({
            success: true,
            data: ledger,
            message: `Ledger ${ledger.isActive ? 'activated' : 'deactivated'} successfully`
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// @desc    Get ledger categories and groups (for dropdown options)
// @route   GET /api/ledgers/options
// @access  Private (ledger.view)
const getLedgerOptions = asyncHandler(async (req, res) => {
    try {
        const categories = [
            'Current Assets',
            'Fixed Assets',
            'Current Liabilities',
            'Long Term Liabilities',
            'Capital Account',
            'Direct Income',
            'Indirect Income',
            'Direct Expenses',
            'Indirect Expenses'
        ];

        const groups = [
            'Cash in Hand',
            'Bank Accounts',
            'Stock in Hand',
            'Sundry Debtors',
            'Loans & Advances',
            'Fixed Assets',
            'Sundry Creditors',
            'Duties & Taxes',
            'Provisions',
            'Capital Account',
            'Reserves & Surplus',
            'Sales Account',
            'Service Income',
            'Other Income',
            'Purchase Account',
            'Direct Expenses',
            'Administrative Expenses',
            'Selling & Distribution',
            'Financial Charges'
        ];

        const taxPercentages = [0, 5, 12, 18, 24];

        res.status(200).json({
            success: true,
            data: {
                categories,
                groups,
                taxPercentages
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// @desc    Get tax ledgers only
// @route   GET /api/ledgers/tax-ledgers
// @access  Private (ledger.view)
const getTaxLedgers = asyncHandler(async (req, res) => {
    try {
        const taxLedgers = await Ledger.find({
            store: req.user.store,
            isTaxLedger: true,
            isActive: true
        }).select('name taxPercentage ledgerCategory ledgerGroup');

        res.status(200).json({
            success: true,
            data: taxLedgers
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// @desc    Get ledgers by category
// @route   GET /api/ledgers/by-category/:category
// @access  Private (ledger.view)
const getLedgersByCategory = asyncHandler(async (req, res) => {
    try {
        const { category } = req.params;
        const { isActive = true } = req.query;

        const query = {
            store: req.user.store,
            ledgerCategory: category
        };

        if (isActive !== undefined) {
            query.isActive = isActive === 'true';
        }

        const ledgers = await Ledger.find(query)
            .select('name ledgerGroup taxPercentage isTaxLedger currentBalance')
            .sort({ name: 1 });

        res.status(200).json({
            success: true,
            data: ledgers
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = {
    getLedgers,
    getLedgerById,
    createLedger,
    updateLedger,
    deleteLedger,
    toggleLedgerStatus,
    getLedgerOptions,
    getTaxLedgers,
    getLedgersByCategory
};