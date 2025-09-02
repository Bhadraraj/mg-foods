const express = require('express');
const {
  getReferrers,
  getReferrer,
  createReferrer,
  updateReferrer,
  deleteReferrer,
  toggleReferrerStatus
} = require('../controllers/referrerController');
const { protect, checkPermission } = require('../middleware/auth');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(protect);

// Routes
router.route('/')
  .get(checkPermission('referrer.view'), getReferrers)
  .post(checkPermission('referrer.create'), createReferrer);

router.route('/:id')
  .get(checkPermission('referrer.view'), getReferrer)
  .put(checkPermission('referrer.update'), updateReferrer)
  .delete(checkPermission('referrer.delete'), deleteReferrer);

router.route('/:id/toggle-status')
  .put(checkPermission('referrer.update'), toggleReferrerStatus);

module.exports = router;