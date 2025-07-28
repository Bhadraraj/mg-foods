const express = require('express');
const {
  getInventoryOverview,
  getStockMovements,
  adjustStock,
  transferStock,
  getStockAlerts
} = require('../controllers/inventoryController');
const { protect, checkPermission } = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(protect);

router.get('/overview', checkPermission('inventory.view'), getInventoryOverview);
router.get('/movements', checkPermission('inventory.view'), getStockMovements);
router.get('/alerts', checkPermission('inventory.view'), getStockAlerts);
router.post('/adjust', checkPermission('inventory.update'), adjustStock);
router.post('/transfer', checkPermission('inventory.update'), transferStock);

module.exports = router;