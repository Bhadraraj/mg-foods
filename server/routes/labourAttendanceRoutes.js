const express = require('express');
const {
    markAttendance,
    getAttendanceRecords,
    getAttendanceRecord,
    updateAttendanceRecord,
    deleteAttendanceRecord,
    getLabourAttendanceSummary
} = require('../controllers/labourAttendanceController');
const { protect, checkPermission } = require('../middleware/auth');
const { labourAttendanceValidationRules, handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

// All routes in this file are protected
router.use(protect);

router.route('/')
    .post(checkPermission('labourAttendance.create'), labourAttendanceValidationRules(), handleValidationErrors, markAttendance)
    .get(checkPermission('labourAttendance.view'), getAttendanceRecords);

router.route('/:id')
    .get(checkPermission('labourAttendance.view'), getAttendanceRecord)
    .put(checkPermission('labourAttendance.update'), labourAttendanceValidationRules(true), handleValidationErrors, updateAttendanceRecord)
    .delete(checkPermission('labourAttendance.delete'), deleteAttendanceRecord);

router.get('/summary/:labourId', checkPermission('labourAttendance.view'), getLabourAttendanceSummary);

module.exports = router;
