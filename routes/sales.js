const express = require('express');
const {
  createSale,
  getSales,
  getSale,
  updateSale,
  deleteSale,
  getSalesByDateRange,
  getSalesStats,
  generateBill,
  processPayment,
  refundSale
} = require('../controllers/salesController');
const { protect, authorize, checkPermission } = require('../middleware/auth');
const { saleValidationRules, handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

// All routes are protected
router.use(protect);

// Sales routes
router.route('/')
  .get(checkPermission('sales.view'), getSales)
  .post(checkPermission('sales.create'), saleValidationRules(), handleValidationErrors, createSale);

router.get('/stats', checkPermission('sales.view'), getSalesStats);
router.get('/date-range', checkPermission('sales.view'), getSalesByDateRange);

router.route('/:id')
  .get(checkPermission('sales.view'), getSale)
  .put(checkPermission('sales.update'), updateSale)
  .delete(checkPermission('sales.delete'), deleteSale);

// Special operations
router.post('/:id/generate-bill', checkPermission('sales.update'), generateBill);
router.post('/:id/payment', checkPermission('sales.update'), processPayment);
router.post('/:id/refund', checkPermission('sales.update'), refundSale);

module.exports = router;