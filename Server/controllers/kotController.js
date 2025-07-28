const KOT = require('../models/KOT');
const Sale = require('../models/Sale');

// @desc    Get all KOTs with filtering
// @route   GET /api/kot
// @access  Private
const getKOTs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};
    
    if (req.query.status) filter.status = req.query.status;
    if (req.query.kitchen) filter.kitchen = req.query.kitchen;
    if (req.query.dineType) filter.dineType = req.query.dineType;
    if (req.query.priority) filter.priority = req.query.priority;
    
    // Date filter
    if (req.query.date) {
      const startOfDay = new Date(req.query.date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(req.query.date);
      endOfDay.setHours(23, 59, 59, 999);
      
      filter.createdAt = { $gte: startOfDay, $lte: endOfDay };
    }

    // Search filter
    if (req.query.search) {
      filter.$or = [
        { kotNo: { $regex: req.query.search, $options: 'i' } },
        { table: { $regex: req.query.search, $options: 'i' } },
        { 'customer.name': { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const kots = await KOT.find(filter)
      .populate('sale', 'billNo pricing.grandTotal')
      .populate('items.item', 'name category')
      .populate('createdBy', 'name')
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
    res.status(500).json({
      success: false,
      message: 'Error fetching KOTs',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get single KOT
// @route   GET /api/kot/:id
// @access  Private
const getKOT = async (req, res) => {
  try {
    const kot = await KOT.findById(req.params.id)
      .populate('sale', 'billNo customer pricing')
      .populate('items.item', 'name category pricing')
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');

    if (!kot) {
      return res.status(404).json({
        success: false,
        message: 'KOT not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { kot }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching KOT',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Update KOT status
// @route   PUT /api/kot/:id
// @access  Private
const updateKOTStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;

    const kot = await KOT.findById(req.params.id);

    if (!kot) {
      return res.status(404).json({
        success: false,
        message: 'KOT not found'
      });
    }

    // Update KOT
    kot.status = status;
    if (notes) kot.notes = notes;
    kot.updatedBy = req.user.id;

    // Set timestamps based on status
    if (status === 'in-progress' && !kot.startedAt) {
      kot.startedAt = new Date();
    } else if (status === 'completed' && !kot.completedAt) {
      kot.completedAt = new Date();
      kot.actualTime = Math.round((new Date() - kot.createdAt) / (1000 * 60)); // in minutes
      
      // Update all items to completed
      kot.items.forEach(item => {
        if (item.status !== 'completed') {
          item.status = 'completed';
          item.completedAt = new Date();
        }
      });

      // Update sale KOT status
      await Sale.findByIdAndUpdate(kot.sale, { kotStatus: 'completed' });
    }

    await kot.save();

    const updatedKot = await KOT.findById(kot._id)
      .populate('sale', 'billNo')
      .populate('items.item', 'name');

    res.status(200).json({
      success: true,
      message: 'KOT status updated successfully',
      data: { kot: updatedKot }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating KOT status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Update KOT item status
// @route   PUT /api/kot/:id/items/:itemId
// @access  Private
const updateKOTItemStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const kot = await KOT.findById(req.params.id);

    if (!kot) {
      return res.status(404).json({
        success: false,
        message: 'KOT not found'
      });
    }

    const item = kot.items.id(req.params.itemId);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'KOT item not found'
      });
    }

    // Update item status
    item.status = status;
    if (status === 'completed') {
      item.completedAt = new Date();
    }

    kot.updatedBy = req.user.id;
    await kot.save();

    res.status(200).json({
      success: true,
      message: 'KOT item status updated successfully',
      data: { kot }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating KOT item status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get KOTs by status
// @route   GET /api/kot/status/:status
// @access  Private
const getKOTsByStatus = async (req, res) => {
  try {
    const { status } = req.params;

    const kots = await KOT.find({ status })
      .populate('sale', 'billNo customer')
      .populate('items.item', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: kots.length,
      data: { kots }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching KOTs by status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get KOT statistics
// @route   GET /api/kot/stats
// @access  Private
const getKOTStats = async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    // Today's KOT stats
    const kotStats = await KOT.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfDay, $lte: endOfDay }
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          avgTime: { $avg: '$actualTime' }
        }
      }
    ]);

    // Kitchen wise stats
    const kitchenStats = await KOT.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfDay, $lte: endOfDay }
        }
      },
      {
        $group: {
          _id: '$kitchen',
          totalKOTs: { $sum: 1 },
          completedKOTs: {
            $sum: {
              $cond: [{ $eq: ['$status', 'completed'] }, 1, 0]
            }
          },
          avgTime: { $avg: '$actualTime' }
        }
      }
    ]);

    // Pending KOTs
    const pendingKOTs = await KOT.countDocuments({
      status: { $in: ['new', 'in-progress'] }
    });

    res.status(200).json({
      success: true,
      data: {
        statusStats: kotStats.reduce((acc, stat) => {
          acc[stat._id] = {
            count: stat.count,
            avgTime: stat.avgTime || 0
          };
          return acc;
        }, {}),
        kitchenStats,
        pendingKOTs
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching KOT statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getKOTs,
  getKOT,
  updateKOTStatus,
  updateKOTItemStatus,
  getKOTsByStatus,
  getKOTStats
};