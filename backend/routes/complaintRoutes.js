const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const { uploadPhoto } = require('../middleware/upload');
const {
  createComplaint,
  getComplaints,
  getComplaint,
  updateStatus,
  deleteComplaint,
} = require('../controllers/complaintController');

const router = express.Router();
router.use(protect);

router.post('/', authorize('citizen'), uploadPhoto, createComplaint);
router.get('/', getComplaints);
router.get('/:id', getComplaint);
router.patch('/:id/status', authorize('staff', 'admin'), updateStatus);
router.delete('/:id', authorize('citizen', 'admin'), deleteComplaint);

module.exports = router;
