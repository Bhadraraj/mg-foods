const express = require('express');
const {
  getKOTs,
  getKOT,
  updateKOTStatus,
  updateKOTItemStatus,
  getKOTsByStatus,
  getKOTStats
} = require('../controllers/kotController');
const { protect, checkPermission } = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(protect);

router.get('/', checkPermission('kot.view'), getKOTs);
router.get('/stats', checkPermission('kot.view'), getKOTStats);
router.get('/status/:status', checkPermission('kot.view'), getKOTsByStatus);

router.route('/:id')
  .get(checkPermission('kot.view'), getKOT)
  .put(checkPermission('kot.update'), updateKOTStatus);

router.put('/:id/items/:itemId', checkPermission('kot.update'), updateKOTItemStatus);

module.exports = router;