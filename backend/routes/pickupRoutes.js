const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
  createPickup,
  getPickups,
  getPickup,
  updateStatus,
  cancelPickup,
} = require('../controllers/pickupController');

const router = express.Router();
router.use(protect);

router.post('/', authorize('citizen'), createPickup);
router.get('/', getPickups);
router.get('/:id', getPickup);
router.patch('/:id/status', authorize('staff', 'admin'), updateStatus);
router.patch('/:id/cancel', authorize('citizen'), cancelPickup);

module.exports = router;
