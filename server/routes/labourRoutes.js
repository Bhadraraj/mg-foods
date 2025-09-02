const express = require('express');
const labourController = require('../controllers/labourController'); // Import the whole controller object
const { protect, checkPermission } = require('../middleware/auth');
const { labourValidationRules, handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(checkPermission('labour.view'), labourController.getLabours) // Use labourController.getLabours
  .post(
    checkPermission('labour.create'),
    labourValidationRules(),
    handleValidationErrors,
    labourController.createLabour // Use labourController.createLabour
  );

router.route('/:id')
  .get(checkPermission('labour.view'), labourController.getLabour) // Use labourController.getLabour
  .put(
    checkPermission('labour.update'),
    labourValidationRules(true), // Apply validation for update (optional fields)
    handleValidationErrors,      // Handle validation errors for update
    labourController.updateLabour // Use labourController.updateLabour
  )
  .delete(checkPermission('labour.delete'), labourController.deleteLabour); // Use labourController.deleteLabour

// The route for toggling status
router.put('/:id/toggle-status', checkPermission('labour.update'), labourController.toggleLabourStatus);

module.exports = router;
