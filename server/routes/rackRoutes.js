const express = require('express');
const router = express.Router();
const {
    getRacks,
    getRack,
    createRack,
    updateRack,
    deleteRack,
    addItemToRack,
    removeItemFromRack,
    getAvailableRacks,
    getRacksByItem,
    reserveRackSpace,
    releaseRackSpace,
    getRackAlerts,
    getAllRackAlerts,
    updateRackTemperature
} = require('../controllers/rackController');

const { protect, checkPermission } = require('../middleware/auth');

// Apply protection middleware to all routes
router.use(protect);

// Routes that need to come before parameterized routes
// Available racks - must come before /:id routes
router.get('/available', checkPermission('rack.view'), getAvailableRacks);

// All alerts - must come before /:id routes  
router.get('/alerts/all', checkPermission('rack.view'), getAllRackAlerts);

// Items by rack - must come before /:id routes
router.get('/by-item/:itemId', checkPermission('rack.view'), getRacksByItem);

// Basic CRUD routes
router.route('/')
    .get(checkPermission('rack.view'), getRacks)
    .post(checkPermission('rack.create'), createRack);

// Single rack routes
router.route('/:id')
    .get(checkPermission('rack.view'), getRack)
    .put(checkPermission('rack.update'), updateRack)
    .delete(checkPermission('rack.delete'), deleteRack);

// Item management routes
router.route('/:id/items')
    .post(checkPermission('rack.update'), addItemToRack);

router.route('/:id/items/:itemId')
    .delete(checkPermission('rack.update'), removeItemFromRack);

// Reserve and release space routes
router.route('/:id/reserve')
    .post(checkPermission('rack.update'), reserveRackSpace)
    .delete(checkPermission('rack.update'), releaseRackSpace);

// Alerts for specific rack
router.route('/:id/alerts')
    .get(checkPermission('rack.view'), getRackAlerts);

// Temperature control
router.route('/:id/temperature')
    .put(checkPermission('rack.update'), updateRackTemperature);

module.exports = router;