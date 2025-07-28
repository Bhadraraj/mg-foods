const express = require('express');
const {
  createItem,
  getItems,
  getItem,
  updateItem,
  deleteItem,
  updateStock,
  getLowStockItems,
  getItemsByCategory,
  bulkUpdateStock
} = require('../controllers/itemsController');
const { protect, checkPermission } = require('../middleware/auth');
const { itemValidationRules, handleValidationErrors } = require('../middleware/validation');
const { upload, handleUploadError } = require('../middleware/upload');

const router = express.Router();

// All routes are protected
router.use(protect);

// Items routes
router.route('/')
  .get(checkPermission('items.view'), getItems)
  .post(checkPermission('items.create'), upload.array('images', 5), handleUploadError, itemValidationRules(), handleValidationErrors, createItem);

router.get('/low-stock', checkPermission('items.view'), getLowStockItems);
router.get('/category/:categoryId', checkPermission('items.view'), getItemsByCategory);
router.post('/bulk-stock-update', checkPermission('items.update'), bulkUpdateStock);

router.route('/:id')
  .get(checkPermission('items.view'), getItem)
  .put(checkPermission('items.update'), upload.array('images', 5), handleUploadError, updateItem)
  .delete(checkPermission('items.delete'), deleteItem);

router.put('/:id/stock', checkPermission('items.update'), updateStock);

module.exports = router;