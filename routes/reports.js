const express = require('express');
const {
  getSalesReport,
  getPurchaseReport,
  getInventoryReport,
  getGSTReport,
  getProfitLossReport,
  getTaxReport,
  getCustomerReport,
  getVendorReport,
  getItemWiseReport,
  getCashBookReport
} = require('../controllers/reportController');
const { protect, checkPermission } = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(protect);
router.use(checkPermission('reports.view'));

router.get('/sales', getSalesReport);
router.get('/purchase', getPurchaseReport);
router.get('/inventory', getInventoryReport);
router.get('/gst', getGSTReport);
router.get('/profit-loss', getProfitLossReport);
router.get('/tax', getTaxReport);
router.get('/customers', getCustomerReport);
router.get('/vendors', getVendorReport);
router.get('/items', getItemWiseReport);
router.get('/cash-book', getCashBookReport);

module.exports = router;