const Table = require('../models/Table');
const asyncHandler = require('express-async-handler');

// @desc    Get all tables
// @route   GET /api/tables
// @access  Private (table.view)
const getTables = asyncHandler(async (req, res) => {
    const {
        page = 1,
        limit = 50,
        search = '',
        status,
        isActive,
        parentOnly = 'false',
        sortBy = 'tableNumber',
        sortOrder = 'asc'
    } = req.query;

    // Build query
    let query = { store: req.user.store };

    // Search functionality
    if (search) {
        query.$or = [
            { name: { $regex: search, $options: 'i' } },
            { tableNumber: { $regex: search, $options: 'i' } },
            { location: { $regex: search, $options: 'i' } }
        ];
    }

    // Filter by status
    if (status) {
        query.status = status;
    }

    // Filter by active status
    if (isActive !== undefined) {
        query.isActive = isActive === 'true';
    }

    // Filter parent tables only
    if (parentOnly === 'true') {
        query.parentTable = null;
    }

    // Calculate pagination
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const startIndex = (pageNum - 1) * limitNum;

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    try {
        const tables = await Table.find(query)
            .populate('parentTable', 'name tableNumber')
            .populate('childTables', 'name tableNumber status isOccupied totalAmount elapsedMinutes')
            .populate('createdBy', 'name')
            .populate('updatedBy', 'name')
            .sort(sort)
            .limit(limitNum)
            .skip(startIndex);

        const total = await Table.countDocuments(query);

        res.status(200).json({
            success: true,
            data: tables,
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

// @desc    Get single table
// @route   GET /api/tables/:id
// @access  Private (table.view)
const getTableById = asyncHandler(async (req, res) => {
    try {
        const table = await Table.findById(req.params.id)
            .populate('parentTable', 'name tableNumber')
            .populate('childTables', 'name tableNumber status isOccupied totalAmount elapsedMinutes')
            .populate('createdBy', 'name')
            .populate('updatedBy', 'name');

        if (!table) {
            return res.status(404).json({
                success: false,
                message: 'Table not found'
            });
        }

        res.status(200).json({
            success: true,
            data: table
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// @desc    Create new table
// @route   POST /api/tables
// @access  Private (table.create)
const createTable = asyncHandler(async (req, res) => {
    try {
        const tableData = {
            ...req.body,
            store: req.user.store,
            createdBy: req.user._id
        };

        const table = await Table.create(tableData);

        const populatedTable = await Table.findById(table._id)
            .populate('parentTable', 'name tableNumber')
            .populate('createdBy', 'name');

        res.status(201).json({
            success: true,
            data: populatedTable,
            message: 'Table created successfully'
        });
    } catch (error) {
        if (error.code === 11000) {
            res.status(400).json({
                success: false,
                message: 'Table number already exists'
            });
        } else {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
});

// @desc    Create child table
// @route   POST /api/tables/:id/child
// @access  Private (table.create)
const createChildTable = asyncHandler(async (req, res) => {
    try {
        const parentTable = await Table.findById(req.params.id);

        if (!parentTable) {
            return res.status(404).json({
                success: false,
                message: 'Parent table not found'
            });
        }

        // Get next child table number
        const nextChildNumber = await Table.getNextChildTableNumber(parentTable.tableNumber);
        
        const childTableData = {
            name: `${parentTable.name} - Child`,
            tableNumber: nextChildNumber,
            capacity: parentTable.capacity,
            parentTable: parentTable._id,
            location: parentTable.location,
            store: req.user.store,
            createdBy: req.user._id,
            ...req.body // Allow overriding default values
        };

        const childTable = await Table.create(childTableData);

        const populatedChildTable = await Table.findById(childTable._id)
            .populate('parentTable', 'name tableNumber')
            .populate('createdBy', 'name');

        res.status(201).json({
            success: true,
            data: populatedChildTable,
            message: 'Child table created successfully'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// @desc    Update table
// @route   PUT /api/tables/:id
// @access  Private (table.update)
const updateTable = asyncHandler(async (req, res) => {
    try {
        let table = await Table.findById(req.params.id);

        if (!table) {
            return res.status(404).json({
                success: false,
                message: 'Table not found'
            });
        }

        const updateData = {
            ...req.body,
            updatedBy: req.user._id
        };

        // Handle occupation time
        if (req.body.isOccupied && !table.isOccupied) {
            updateData.occupiedTime = new Date();
            updateData.status = 'Running';
        } else if (!req.body.isOccupied && table.isOccupied) {
            updateData.occupiedTime = null;
            updateData.elapsedMinutes = 0;
            updateData.status = 'Available';
        }

        table = await Table.findByIdAndUpdate(
            req.params.id,
            updateData,
            {
                new: true,
                runValidators: true
            }
        ).populate('parentTable', 'name tableNumber')
         .populate('childTables', 'name tableNumber status')
         .populate('createdBy', 'name')
         .populate('updatedBy', 'name');

        res.status(200).json({
            success: true,
            data: table,
            message: 'Table updated successfully'
        });
    } catch (error) {
        if (error.code === 11000) {
            res.status(400).json({
                success: false,
                message: 'Table number already exists'
            });
        } else {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
});

// @desc    Update table status
// @route   PUT /api/tables/:id/status
// @access  Private (table.update)
const updateTableStatus = asyncHandler(async (req, res) => {
    const { status, totalAmount, elapsedMinutes } = req.body;

    try {
        const table = await Table.findById(req.params.id);

        if (!table) {
            return res.status(404).json({
                success: false,
                message: 'Table not found'
            });
        }

        const updateData = {
            status,
            updatedBy: req.user._id
        };

        // Handle different status changes
        switch (status) {
            case 'Running':
                updateData.isOccupied = true;
                updateData.occupiedTime = new Date();
                break;
            case 'Bill Generated':
                updateData.totalAmount = totalAmount || table.totalAmount;
                updateData.elapsedMinutes = elapsedMinutes || table.elapsedMinutes;
                break;
            case 'Available':
                updateData.isOccupied = false;
                updateData.occupiedTime = null;
                updateData.totalAmount = 0;
                updateData.elapsedMinutes = 0;
                break;
        }

        const updatedTable = await Table.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        ).populate('parentTable', 'name tableNumber')
         .populate('childTables', 'name tableNumber status');

        res.status(200).json({
            success: true,
            data: updatedTable,
            message: 'Table status updated successfully'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// @desc    Delete table
// @route   DELETE /api/tables/:id
// @access  Private (table.delete)
const deleteTable = asyncHandler(async (req, res) => {
    try {
        const table = await Table.findById(req.params.id);

        if (!table) {
            return res.status(404).json({
                success: false,
                message: 'Table not found'
            });
        }

        // Check if table is occupied
        if (table.isOccupied) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete occupied table'
            });
        }

        // Check if parent table has child tables
        if (table.isParentTable() && table.childTables.length > 0) {
            const childTablesOccupied = await Table.countDocuments({
                _id: { $in: table.childTables },
                isOccupied: true
            });

            if (childTablesOccupied > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Cannot delete parent table with occupied child tables'
                });
            }
        }

        await Table.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Table deleted successfully'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// @desc    Get table statistics
// @route   GET /api/tables/stats
// @access  Private (table.view)
const getTableStats = asyncHandler(async (req, res) => {
    try {
        const stats = await Table.aggregate([
            { $match: { store: req.user.store, isActive: true, parentTable: null } },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        const totalTables = await Table.countDocuments({ 
            store: req.user.store, 
            isActive: true, 
            parentTable: null 
        });

        const occupiedTables = await Table.countDocuments({ 
            store: req.user.store, 
            isOccupied: true 
        });

        const totalRevenue = await Table.aggregate([
            { $match: { store: req.user.store, status: 'Bill Generated' } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);

        const formattedStats = {
            total: totalTables,
            occupied: occupiedTables,
            available: totalTables - occupiedTables,
            revenue: totalRevenue[0]?.total || 0,
            statusBreakdown: stats.reduce((acc, stat) => {
                acc[stat._id] = stat.count;
                return acc;
            }, {})
        };

        res.status(200).json({
            success: true,
            data: formattedStats
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = {
    getTables,
    getTableById,
    createTable,
    createChildTable,
    updateTable,
    updateTableStatus,
    deleteTable,
    getTableStats
};