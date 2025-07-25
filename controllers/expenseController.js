const Expense = require('../models/Expense');

// @desc    Create new expense
// @route   POST /api/expense
// @access  Private
const createExpense = async (req, res) => {
  try {
    const expenseData = {
      ...req.body,
      createdBy: req.user.id
    };

    // Handle file attachments
    if (req.files && req.files.length > 0) {
      expenseData.attachments = req.files.map(file => ({
        url: file.path,
        publicId: file.filename,
        filename: file.originalname,
        fileType: file.mimetype
      }));
    }

    const expense = await Expense.create(expenseData);

    const populatedExpense = await Expense.findById(expense._id)
      .populate('vendor', 'name contact')
      .populate('createdBy', 'name');

    res.status(201).json({
      success: true,
      message: 'Expense created successfully',
      data: { expense: populatedExpense }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating expense',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get all expenses with pagination and filtering
// @route   GET /api/expense
// @access  Private
const getExpenses = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};
    
    if (req.query.category) filter.category = req.query.category;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.paymentMethod) filter.paymentMethod = req.query.paymentMethod;
    if (req.query.vendor) filter.vendor = req.query.vendor;
    
    // Date range filter
    if (req.query.startDate || req.query.endDate) {
      filter.date = {};
      if (req.query.startDate) filter.date.$gte = new Date(req.query.startDate);
      if (req.query.endDate) filter.date.$lte = new Date(req.query.endDate);
    }

    // Amount range filter
    if (req.query.minAmount || req.query.maxAmount) {
      filter.amount = {};
      if (req.query.minAmount) filter.amount.$gte = parseFloat(req.query.minAmount);
      if (req.query.maxAmount) filter.amount.$lte = parseFloat(req.query.maxAmount);
    }

    // Search filter
    if (req.query.search) {
      filter.$or = [
        { expenseId: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
        { 'billDetails.billNumber': { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const expenses = await Expense.find(filter)
      .populate('vendor', 'name contact')
      .populate('createdBy', 'name')
      .populate('approvedBy', 'name')
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Expense.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: expenses.length,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      data: { expenses }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching expenses',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get single expense
// @route   GET /api/expense/:id
// @access  Private
const getExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id)
      .populate('vendor', 'name contact business')
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email')
      .populate('approvedBy', 'name email');

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { expense }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching expense',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Update expense
// @route   PUT /api/expense/:id
// @access  Private
const updateExpense = async (req, res) => {
  try {
    let expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }

    // Check if expense can be updated
    if (expense.status === 'paid') {
      return res.status(400).json({
        success: false,
        message: 'Cannot update paid expense'
      });
    }

    const updateData = {
      ...req.body,
      updatedBy: req.user.id
    };

    // Handle new attachments
    if (req.files && req.files.length > 0) {
      const newAttachments = req.files.map(file => ({
        url: file.path,
        publicId: file.filename,
        filename: file.originalname,
        fileType: file.mimetype
      }));
      
      updateData.attachments = [...(expense.attachments || []), ...newAttachments];
    }

    expense = await Expense.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
    .populate('vendor', 'name contact')
    .populate('createdBy', 'name');

    res.status(200).json({
      success: true,
      message: 'Expense updated successfully',
      data: { expense }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating expense',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Delete expense
// @route   DELETE /api/expense/:id
// @access  Private
const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }

    // Check if expense can be deleted
    if (expense.status === 'paid') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete paid expense'
      });
    }

    await Expense.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Expense deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting expense',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Approve expense
// @route   PUT /api/expense/:id/approve
// @access  Private
const approveExpense = async (req, res) => {
  try {
    const { status, notes } = req.body; // status: 'approved' or 'rejected'

    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }

    if (expense.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Only pending expenses can be approved or rejected'
      });
    }

    expense.status = status;
    expense.approvedBy = req.user.id;
    expense.approvedAt = new Date();
    expense.updatedBy = req.user.id;
    
    if (notes) {
      expense.notes = `${expense.notes || ''}\nApproval Notes: ${notes}`;
    }

    await expense.save();

    const updatedExpense = await Expense.findById(expense._id)
      .populate('approvedBy', 'name');

    res.status(200).json({
      success: true,
      message: `Expense ${status} successfully`,
      data: { expense: updatedExpense }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error approving expense',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get expense statistics
// @route   GET /api/expense/stats
// @access  Private
const getExpenseStats = async (req, res) => {
  try {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfYear = new Date(today.getFullYear(), 0, 1);

    // Monthly stats
    const monthlyStats = await Expense.aggregate([
      {
        $match: {
          date: { $gte: startOfMonth },
          status: { $ne: 'rejected' }
        }
      },
      {
        $group: {
          _id: null,
          totalExpenses: { $sum: '$amount' },
          totalCount: { $sum: 1 },
          pendingExpenses: {
            $sum: {
              $cond: [{ $eq: ['$status', 'pending'] }, '$amount', 0]
            }
          },
          approvedExpenses: {
            $sum: {
              $cond: [{ $eq: ['$status', 'approved'] }, '$amount', 0]
            }
          },
          paidExpenses: {
            $sum: {
              $cond: [{ $eq: ['$status', 'paid'] }, '$amount', 0]
            }
          }
        }
      }
    ]);

    // Category wise expenses
    const categoryStats = await Expense.aggregate([
      {
        $match: {
          date: { $gte: startOfMonth },
          status: { $ne: 'rejected' }
        }
      },
      {
        $group: {
          _id: '$category',
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { totalAmount: -1 } }
    ]);

    // Payment method wise stats
    const paymentStats = await Expense.aggregate([
      {
        $match: {
          date: { $gte: startOfMonth },
          status: 'paid'
        }
      },
      {
        $group: {
          _id: '$paymentMethod',
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        monthly: monthlyStats[0] || {
          totalExpenses: 0,
          totalCount: 0,
          pendingExpenses: 0,
          approvedExpenses: 0,
          paidExpenses: 0
        },
        categoryStats,
        paymentStats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching expense statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  createExpense,
  getExpenses,
  getExpense,
  updateExpense,
  deleteExpense,
  approveExpense,
  getExpenseStats
};