const express = require('express');
const {
  createExpense,
  getExpenses,
  getExpense,
  updateExpense,
  deleteExpense,
  approveExpense,
  getExpenseStats
} = require('../controllers/expenseController');
const { protect, checkPermission } = require('../middleware/auth');
const { expenseValidationRules, handleValidationErrors } = require('../middleware/validation');
const { upload, handleUploadError } = require('../middleware/upload');

const router = express.Router();

// All routes are protected
router.use(protect);

router.route('/')
  .get(checkPermission('expense.view'), getExpenses)
  .post(checkPermission('expense.create'), upload.array('attachments', 5), handleUploadError, expenseValidationRules(), handleValidationErrors, createExpense);

router.get('/stats', checkPermission('expense.view'), getExpenseStats);

router.route('/:id')
  .get(checkPermission('expense.view'), getExpense)
  .put(checkPermission('expense.update'), upload.array('attachments', 5), handleUploadError, updateExpense)
  .delete(checkPermission('expense.delete'), deleteExpense);

router.put('/:id/approve', checkPermission('expense.update'), approveExpense);

module.exports = router;