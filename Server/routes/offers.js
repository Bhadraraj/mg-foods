const express = require('express');
const {
  createOffer,
  getOffers,
  getOffer,
  updateOffer,
  deleteOffer,
  validateOffer,
  getActiveOffers
} = require('../controllers/offerController');
const { protect, checkPermission } = require('../middleware/auth');
const { upload, handleUploadError } = require('../middleware/upload');

const router = express.Router();

// All routes are protected
router.use(protect);

router.route('/')
  .get(checkPermission('offers.view'), getOffers)
  .post(checkPermission('offers.create'), upload.single('image'), handleUploadError, createOffer);

router.get('/active', getActiveOffers);
router.post('/validate', validateOffer);

router.route('/:id')
  .get(checkPermission('offers.view'), getOffer)
  .put(checkPermission('offers.update'), upload.single('image'), handleUploadError, updateOffer)
  .delete(checkPermission('offers.delete'), deleteOffer);

module.exports = router;