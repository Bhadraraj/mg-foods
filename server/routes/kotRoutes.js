// routes/kotRoutes.js
const express = require('express');
const {
    createKOT,
    getKOTs,
    getKOTById,
    updateKOT,
    updateKOTItemStatus,
    markKOTPrinted,
    deleteKOT,
    getKOTStats,
    getActiveKOTs,
    completeKOT
} = require('../controllers/kotController');
const { protect, checkPermission } = require('../middleware/auth');

const router = express.Router();

// Apply the `protect` middleware to all routes in this file
router.use(protect);

// KOT Statistics - Must come before /:id routes
router.get('/stats', checkPermission('kots.view'), getKOTStats);

// Get active KOTs for kitchen display
router.get('/active', checkPermission('kots.view'), getActiveKOTs);

// Main KOT routes
router.route('/')
    .get(checkPermission('kots.view'), getKOTs)
    .post(checkPermission('kots.create'), createKOT);

// Individual KOT operations
router.route('/:id')
    .get(checkPermission('kots.view'), getKOTById)
    .put(checkPermission('kots.update'), updateKOT)
    .delete(checkPermission('kots.delete'), deleteKOT);

// KOT status operations
router.put('/:id/complete', checkPermission('kots.update'), completeKOT);
router.put('/:id/print', checkPermission('kots.update'), markKOTPrinted);

// Individual KOT item status update
router.put('/:kotId/items/:itemId/status', checkPermission('kots.update'), updateKOTItemStatus);

module.exports = router;