const Labour = require('../models/Labour');
const LabourAttendance = require('../models/LabourAttendance'); // Import LabourAttendance model

// Helper function to format date to YYYY-MM-DD for consistency
const formatDateToYYYYMMDD = (date) => {
    const d = new Date(date);
    d.setUTCHours(0, 0, 0, 0); // Normalize to start of day UTC
    return d.toISOString().split('T')[0];
};

// @desc    Get all labour records
// @route   GET /api/labour
// @access  Private (Admin/Manager)
const getLabourRecords = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { mobileNumber: { $regex: req.query.search, $options: 'i' } },
        { address: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const labourRecords = await Labour.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(); // Use .lean() for plain JavaScript objects for easier modification

    const total = await Labour.countDocuments(filter);

    // Fetch attendance summary for all labourers in the current page
    const labourIds = labourRecords.map(labour => labour._id);
    const numDays = 7; // For "Last 7 days status"

    const endDate = new Date();
    endDate.setUTCHours(23, 59, 59, 999);
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - numDays + 1);
    startDate.setUTCHours(0, 0, 0, 0);

    const allAttendance = await LabourAttendance.find({
        labourId: { $in: labourIds },
        date: { $gte: startDate, $lte: endDate }
    })
    .select('labourId date status')
    .sort({ date: 1 }); // Sort by date ascending

    // Map attendance records to their respective labourers
    const attendanceMap = new Map(); // Map<labourId, Map<formattedDate, status>>
    allAttendance.forEach(record => {
        const labourIdStr = record.labourId.toString();
        if (!attendanceMap.has(labourIdStr)) {
            attendanceMap.set(labourIdStr, new Map());
        }
        attendanceMap.get(labourIdStr).set(formatDateToYYYYMMDD(record.date), record.status);
    });

    // Add attendance summary to each labour record
    const labourRecordsWithAttendance = labourRecords.map(labour => {
        const labourIdStr = labour._id.toString();
        const dailyStatus = [];
        const labourAttendanceForSummary = attendanceMap.get(labourIdStr) || new Map();

        for (let i = 0; i < numDays; i++) {
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + i);
            const formattedDate = formatDateToYYYYMMDD(currentDate);
            dailyStatus.push({
                date: formattedDate,
                status: labourAttendanceForSummary.get(formattedDate) || 'Not Marked'
            });
        }
        return { ...labour, last7DaysStatus: dailyStatus };
    });


    res.status(200).json({
      success: true,
      count: labourRecordsWithAttendance.length,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      data: { labourRecords: labourRecordsWithAttendance }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error fetching labour records',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get single labour record
// @route   GET /api/labour/:id
// @access  Private (Admin/Manager)
const getLabourRecord = async (req, res) => {
  try {
    const labour = await Labour.findById(req.params.id).lean(); // Use .lean()

    if (!labour) {
      return res.status(404).json({
        success: false,
        message: 'Labour record not found'
      });
    }

    // Fetch attendance summary for this single labourer (last 7 days)
    const numDays = 7;
    const endDate = new Date();
    endDate.setUTCHours(23, 59, 59, 999);
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - numDays + 1);
    startDate.setUTCHours(0, 0, 0, 0);

    const attendanceRecords = await LabourAttendance.find({
        labourId: labour._id,
        date: { $gte: startDate, $lte: endDate }
    })
    .sort({ date: 1 })
    .select('date status');

    const attendanceMap = new Map();
    attendanceRecords.forEach(record => {
        attendanceMap.set(formatDateToYYYYMMDD(record.date), record.status);
    });

    const dailyStatus = [];
    for (let i = 0; i < numDays; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i);
        const formattedDate = formatDateToYYYYMMDD(currentDate);
        dailyStatus.push({
            date: formattedDate,
            status: attendanceMap.get(formattedDate) || 'Not Marked'
        });
    }

    // Add attendance summary to the labour object
    labour.last7DaysStatus = dailyStatus;

    res.status(200).json({
      success: true,
      data: { labour }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error fetching labour record',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Create new labour record
// @route   POST /api/labour
// @access  Private (Admin)
const createLabourRecord = async (req, res) => {
  try {
    const { name, mobileNumber, address, monthlySalary } = req.body;

    // Check if mobile number already exists
    const existingLabour = await Labour.findOne({ mobileNumber });
    if (existingLabour) {
      return res.status(400).json({
        success: false,
        message: 'Labour with this mobile number already exists'
      });
    }

    const labour = await Labour.create({
      name,
      mobileNumber,
      address,
      monthlySalary
    });

    res.status(201).json({
      success: true,
      message: 'Labour record created successfully',
      data: { labour }
    });
  } catch (error) {
    console.error(error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error creating labour record',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Update labour record
// @route   PUT /api/labour/:id
// @access  Private (Admin/Manager)
const updateLabourRecord = async (req, res) => {
  try {
    const labour = await Labour.findById(req.params.id);

    if (!labour) {
      return res.status(404).json({
        success: false,
        message: 'Labour record not found'
      });
    }

    const { mobileNumber, ...updateData } = req.body;

    // If mobileNumber is being updated, check for uniqueness
    if (mobileNumber && mobileNumber !== labour.mobileNumber) {
      const existingLabour = await Labour.findOne({ mobileNumber });
      if (existingLabour && existingLabour._id.toString() !== req.params.id) {
        return res.status(400).json({ success: false, message: 'Mobile number already in use' });
      }
      updateData.mobileNumber = mobileNumber;
    }

    const updatedLabour = await Labour.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Labour record updated successfully',
      data: { labour: updatedLabour }
    });
  } catch (error) {
    console.error(error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error updating labour record',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Delete labour record
// @route   DELETE /api/labour/:id
// @access  Private (Admin)
const deleteLabourRecord = async (req, res) => {
  try {
    const labour = await Labour.findById(req.params.id);

    if (!labour) {
      return res.status(404).json({
        success: false,
        message: 'Labour record not found'
      });
    }

    await Labour.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Labour record deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error deleting labour record',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Toggle labour status (active/inactive)
// @route   PUT /api/labour/:id/toggle-status
// @access  Private (Admin/Manager)
const toggleLabourStatus = async (req, res) => {
    try {
        const labour = await Labour.findById(req.params.id);

        if (!labour) {
            return res.status(404).json({ success: false, message: 'Labour record not found' });
        }

        labour.isActive = !labour.isActive;
        await labour.save();

        res.status(200).json({
            success: true,
            message: `Labour record ${labour.isActive ? 'activated' : 'deactivated'} successfully`,
            data: { labour }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Error toggling labour record status',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};


module.exports = {
  getLabours: getLabourRecords,
  getLabour: getLabourRecord,
  createLabour: createLabourRecord,
  updateLabour: updateLabourRecord,
  deleteLabour: deleteLabourRecord,
  toggleLabourStatus
};
