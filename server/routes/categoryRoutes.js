    const express = require('express');
    const {
        createCategory,
        getCategories,
        getCategoryById,
        updateCategory,
        deleteCategory,
        getAvailableItems,
        assignItemsToCategory,
        removeItemsFromCategory
    } = require('../controllers/categoryController');
    const { protect, checkPermission } = require('../middleware/auth'); // Changed from authorize to checkPermission

    const router = express.Router();

    // Apply authentication middleware to all routes
    router.use(protect);

    // Routes - using checkPermission instead of authorize
    router.route('/')
        .get(checkPermission('itemCategory.view'), getCategories)
        .post(checkPermission('itemCategory.create'), createCategory);

    router.route('/available-items')
        .get(checkPermission('itemCategory.view'), getAvailableItems);

    router.route('/:id')
        .get(checkPermission('itemCategory.view'), getCategoryById)
        .put(checkPermission('itemCategory.update'), updateCategory)
        .delete(checkPermission('itemCategory.delete'), deleteCategory);
    router.route('/:id/assign-items')
        .post(checkPermission('itemCategory.update'), assignItemsToCategory);

    router.route('/:id/items') 
        .delete(checkPermission('itemCategory.update'), removeItemsFromCategory);

    module.exports = router;