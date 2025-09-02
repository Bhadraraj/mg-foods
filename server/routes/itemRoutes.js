        const express = require('express');
        const {
            getItems,
            getItemById,
            createItem,
            updateItem,
            deleteItem,
            uploadItemImages
        } = require('../controllers/itemController');
        const { protect, checkPermission } = require('../middleware/auth');
        const router = express.Router();
        const path = require('path');

        // Apply the `protect` middleware to all routes in this file
        router.use(protect);

        // Middleware to handle multer errors
        const handleMulterError = (error, req, res, next) => {
            if (error) {
                console.error('Multer error:', error);
                return res.status(400).json({
                    success: false,
                    message: 'File upload error',
                    error: error.message
                });
            }
            next();
        };

        // Debug middleware to log file uploads
        const debugFileUpload = (req, res, next) => {
            console.log('=== FILE UPLOAD DEBUG ===');
            console.log('Files:', req.files);
            console.log('Body:', req.body);
            console.log('========================');
            next();
        };

        // Routes with image upload support
        router.route('/')
            .get(checkPermission('items.view'), getItems)
            .post(
                checkPermission('items.create'),
                (req, res, next) => {
                    // Custom wrapper to handle multer errors properly
                    uploadItemImages(req, res, (error) => {
                        if (error) {
                            console.error('Upload error:', error);
                            return res.status(400).json({
                                success: false,
                                message: 'File upload failed',
                                error: error.message
                            });
                        }
                        next();
                    });
                },
                debugFileUpload, // Add debug middleware (remove in production)
                createItem
            );

        router.route('/:id')
            .get(checkPermission('items.view'), getItemById)
            .put(
                checkPermission('items.update'),
                (req, res, next) => {
                    // Custom wrapper to handle multer errors properly
                    uploadItemImages(req, res, (error) => {
                        if (error) {
                            console.error('Upload error:', error);
                            return res.status(400).json({
                                success: false,
                                message: 'File upload failed',
                                error: error.message
                            });
                        }
                        next();
                    });
                },
                debugFileUpload, // Add debug middleware (remove in production)
                updateItem
            )
            .delete(checkPermission('items.delete'), deleteItem);

        module.exports = router;