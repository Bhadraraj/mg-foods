const express = require('express');
const { register, login, logout, refreshToken, getMe, updateProfile, changePassword } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { loginValidationRules, userValidationRules, handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

// Public routes
router.post('/register', userValidationRules(), handleValidationErrors, register);
router.post('/login', loginValidationRules(), handleValidationErrors, login);
router.post('/refresh-token', refreshToken);

// Protected routes
router.use(protect); // All routes below this middleware are protected

router.post('/logout', logout);
router.get('/me', getMe);
router.put('/profile', updateProfile);
router.put('/change-password', changePassword);

module.exports = router;