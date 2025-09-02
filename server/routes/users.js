const express = require('express');
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  toggleUserStatus,
  updateUserPermissions
} = require('../controllers/userController');
const { protect, authorize, checkPermission } = require('../middleware/auth');
const { userValidationRules, handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(checkPermission('users.view'), getUsers)
  .post(checkPermission('users.create'), userValidationRules(), handleValidationErrors, createUser);

router.route('/:id')
  .get(checkPermission('users.view'), getUser)
  .put(checkPermission('users.update'), updateUser)
  .delete(checkPermission('users.delete'), deleteUser);

router.put('/:id/toggle-status', checkPermission('users.update'), toggleUserStatus);
router.put('/:id/permissions', checkPermission('users.update'), updateUserPermissions);

module.exports = router;