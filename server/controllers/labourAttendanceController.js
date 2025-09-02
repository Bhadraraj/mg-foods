const LabourAttendance = require('../models/LabourAttendance');
const Labour = require('../models/Labour'); // Needed to populate labour details

// Helper function to format date to YYYY-MM-DD for consistency
const formatDateToYYYYMMDD = (date) => {
    const d = new Date(date);
    d.setUTCHours(0, 0, 0, 0); // Normalize to start of day UTC
    return d.toISOString().split('T')[0];
};

// Helper function to get start and end dates of a specific week in a year
const getWeekRange = (week, year) => {
    const d = new Date(year, 0, 1 + (week - 1) * 7); // Start of the year + (week - 1) weeks
    d.setDate(d.getDate() + (4 - (d.getDay() || 7))); // Adjust to Thursday in case year starts on non-Thursday
    const yearStart = new Date(d.getFullYear(), 0, 1);
    const weekStart = new Date(d.getFullYear(), 0, 1 + (week - 1) * 7);
    weekStart.setDate(weekStart.getDate() - (weekStart.getDay() + 6) % 7); // Adjust to Monday of that week

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6); // End of the week (Sunday)

    weekStart.setUTCHours(0, 0, 0, 0);
    weekEnd.setUTCHours(23, 59, 59, 999);

    return { startDate: weekStart, endDate: weekEnd };
};

// @desc    Mark attendance for a labourer
// @route   POST /api/labour-attendance
// @access  Private (labourAttendance.create)
const markAttendance = async (req, res) => {
    try {
        const { labourId, date, status, clockInTime, clockOutTime, notes } = req.body;

        // Normalize date to start of day to ensure unique per day
        const normalizedDate = new Date(date);
        normalizedDate.setUTCHours(0, 0, 0, 0);

        // Check if attendance already exists for this labourer on this date
        const existingAttendance = await LabourAttendance.findOne({
            labourId,
            date: normalizedDate
        });

        if (existingAttendance) {
            return res.status(400).json({
                success: false,
                message: 'Attendance already marked for this labourer on this date. Use PUT to update.'
            });
        }

        const newAttendance = await LabourAttendance.create({
            labourId,
            date: normalizedDate,
            status,
            clockInTime: (status === 'Present' || status === 'Half-day') ? clockInTime : undefined,
            clockOutTime: (status === 'Present' || status === 'Half-day') ? clockOutTime : undefined,
            notes
        });

        res.status(201).json({
            success: true,
            message: 'Attendance marked successfully',
            data: { attendance: newAttendance }
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
            message: 'Error marking attendance',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// @desc    Get attendance records with filters (date, date range, week, year, name, status)
// @route   GET /api/labour-attendance
// @access  Private (labourAttendance.view)
const getAttendanceRecords = async (req, res) => {
    try {
        const { labourId, date, startDate, endDate, name, status, week, year, page = 1, limit = 20 } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const filter = {};
        let finalStartDate, finalEndDate;

        // Determine date range based on query parameters
        if (startDate && endDate) {
            finalStartDate = new Date(startDate);
            finalStartDate.setUTCHours(0, 0, 0, 0);
            finalEndDate = new Date(endDate);
            finalEndDate.setUTCHours(23, 59, 59, 999);
        } else if (date) {
            const exactDate = new Date(date);
            exactDate.setUTCHours(0, 0, 0, 0);
            finalStartDate = exactDate;
            finalEndDate = new Date(exactDate);
            finalEndDate.setUTCHours(23, 59, 59, 999);
        } else if (week && year) {
            const { startDate: ws, endDate: we } = getWeekRange(parseInt(week), parseInt(year));
            finalStartDate = ws;
            finalEndDate = we;
        } else if (year) {
            // If only year is provided, get for the whole year
            finalStartDate = new Date(parseInt(year), 0, 1);
            finalStartDate.setUTCHours(0, 0, 0, 0);
            finalEndDate = new Date(parseInt(year), 11, 31);
            finalEndDate.setUTCHours(23, 59, 59, 999);
        }

        if (finalStartDate && finalEndDate) {
            filter.date = { $gte: finalStartDate, $lte: finalEndDate };
        }

        // Filter by specific labourer
        if (labourId) {
            filter.labourId = labourId;
        }

        // Filter by status
        if (status) {
            filter.status = status;
        }

        let labourFilter = {};
        // Filter by labour name (requires population and matching)
        if (name) {
            labourFilter.name = { $regex: name, $options: 'i' };
        }

        let attendanceRecords;
        let total;

        if (Object.keys(labourFilter).length > 0) {
            // If filtering by labour name, first find matching labourers
            const matchingLabours = await Labour.find(labourFilter, '_id'); // Only fetch _id
            const labourIds = matchingLabours.map(labour => labour._id);

            if (labourIds.length === 0) {
                return res.status(200).json({
                    success: true,
                    count: 0,
                    pagination: { page: parseInt(page), limit: parseInt(limit), total: 0, pages: 0 },
                    data: { attendanceRecords: [] }
                });
            }
            filter.labourId = { $in: labourIds };
        }

        attendanceRecords = await LabourAttendance.find(filter)
            .populate('labourId', 'name mobileNumber') // Populate labour name and mobileNumber
            .sort({ date: -1, 'labourId.name': 1 }) // Sort by date descending, then name ascending
            .skip(skip)
            .limit(limit);

        total = await LabourAttendance.countDocuments(filter);

        res.status(200).json({
            success: true,
            count: attendanceRecords.length,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            },
            data: { attendanceRecords }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Error fetching attendance records',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// @desc    Get single attendance record
// @route   GET /api/labour-attendance/:id
// @access  Private (labourAttendance.view)
const getAttendanceRecord = async (req, res) => {
    try {
        const attendance = await LabourAttendance.findById(req.params.id).populate('labourId', 'name mobileNumber');

        if (!attendance) {
            return res.status(404).json({
                success: false,
                message: 'Attendance record not found'
            });
        }

        res.status(200).json({
            success: true,
            data: { attendance }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Error fetching attendance record',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// @desc    Update an existing attendance record
// @route   PUT /api/labour-attendance/:id
// @access  Private (labourAttendance.update)
const updateAttendanceRecord = async (req, res) => {
    try {
        const { date, status, clockInTime, clockOutTime, notes } = req.body;

        const attendance = await LabourAttendance.findById(req.params.id);

        if (!attendance) {
            return res.status(404).json({
                success: false,
                message: 'Attendance record not found'
            });
        }

        // Normalize date to start of day for consistency if date is updated
        let updatedDate = attendance.date;
        if (date) {
            const newDate = new Date(date);
            newDate.setUTCHours(0, 0, 0, 0);
            if (newDate.getTime() !== attendance.date.getTime()) {
                // Check for uniqueness if date or labourId changes
                const existing = await LabourAttendance.findOne({
                    labourId: attendance.labourId,
                    date: newDate,
                    _id: { $ne: attendance._id } // Exclude current document
                });
                if (existing) {
                    return res.status(400).json({
                        success: false,
                        message: 'Attendance already exists for this labourer on the new date.'
                    });
                }
                updatedDate = newDate;
            }
        }

        // Update fields
        attendance.date = updatedDate;
        attendance.status = status || attendance.status;
        attendance.notes = notes !== undefined ? notes : attendance.notes;

        // Handle clock-in/out times based on status
        if (attendance.status === 'Present' || attendance.status === 'Half-day') {
            attendance.clockInTime = clockInTime !== undefined ? clockInTime : attendance.clockInTime;
            attendance.clockOutTime = clockOutTime !== undefined ? clockOutTime : attendance.clockOutTime;
        } else {
            attendance.clockInTime = undefined;
            attendance.clockOutTime = undefined;
        }

        await attendance.save();

        res.status(200).json({
            success: true,
            message: 'Attendance record updated successfully',
            data: { attendance }
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
            message: 'Error updating attendance record',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// @desc    Delete an attendance record
// @route   DELETE /api/labour-attendance/:id
// @access  Private (labourAttendance.delete)
const deleteAttendanceRecord = async (req, res) => {
    try {
        const attendance = await LabourAttendance.findById(req.params.id);

        if (!attendance) {
            return res.status(404).json({
                success: false,
                message: 'Attendance record not found'
            });
        }

        await LabourAttendance.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Attendance record deleted successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Error deleting attendance record',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// @desc    Get Labour attendance summary (e.g., last 7 days status)
// @route   GET /api/labour-attendance/summary/:labourId
// @access  Private (labourAttendance.view)
const getLabourAttendanceSummary = async (req, res) => {
    try {
        const { labourId } = req.params;
        const numDays = parseInt(req.query.days) || 7; // Default to last 7 days

        const endDate = new Date();
        endDate.setUTCHours(23, 59, 59, 999);
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - numDays + 1); // +1 to include today
        startDate.setUTCHours(0, 0, 0, 0);

        const attendanceRecords = await LabourAttendance.find({
            labourId,
            date: { $gte: startDate, $lte: endDate }
        })
        .sort({ date: 1 }) // Sort by date ascending to get chronological order
        .select('date status'); // Only select date and status

        // Create a map for quick lookup
        const attendanceMap = new Map();
        attendanceRecords.forEach(record => {
            attendanceMap.set(formatDateToYYYYMMDD(record.date), record.status);
        });

        // Generate status for each day in the range
        const dailyStatus = [];
        for (let i = 0; i < numDays; i++) {
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + i);
            const formattedDate = formatDateToYYYYMMDD(currentDate);
            dailyStatus.push({
                date: formattedDate,
                status: attendanceMap.get(formattedDate) || 'Not Marked' // Default to 'Not Marked'
            });
        }

        res.status(200).json({
            success: true,
            data: {
                labourId,
                summary: dailyStatus
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Error fetching attendance summary',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};


module.exports = {
    markAttendance,
    getAttendanceRecords,
    getAttendanceRecord,
    updateAttendanceRecord,
    deleteAttendanceRecord,
    getLabourAttendanceSummary
};
