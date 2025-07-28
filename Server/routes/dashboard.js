const express = require('express');
const { getDashboardOverview, getSalesAnalytics } = require('../controllers/dashboardController');
const { protect, checkPermission } = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(protect);

router.get('/overview', checkPermission('dashboard.view'), getDashboardOverview);
router.get('/sales-analytics', checkPermission('dashboard.view'), getSalesAnalytics);

module.exports = router;