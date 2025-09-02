const express = require('express');
const {
    getTables,
    getTableById,
    createTable,
    createChildTable,
    updateTable,
    updateTableStatus,
    deleteTable,
    getTableStats
} = require('../controllers/tableController');
const { protect, checkPermission } = require('../middleware/auth');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(protect);

// Routes
router.route('/')
    .get(checkPermission('table.view'), getTables)
    .post(checkPermission('table.create'), createTable);

router.route('/stats')
    .get(checkPermission('table.view'), getTableStats);

router.route('/:id')
    .get(checkPermission('table.view'), getTableById)
    .put(checkPermission('table.update'), updateTable)
    .delete(checkPermission('table.delete'), deleteTable);

router.route('/:id/child')
    .post(checkPermission('table.create'), createChildTable);

router.route('/:id/status')
    .put(checkPermission('table.update'), updateTableStatus);

module.exports = router;