const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const { createZone, getZones, getZone, updateZone, deleteZone } = require('../controllers/zoneController');

const router = express.Router();
router.use(protect); // every zone route needs login

router.get('/', getZones);
router.get('/:id', getZone);
router.post('/', authorize('admin'), createZone);
router.put('/:id', authorize('admin'), updateZone);
router.delete('/:id', authorize('admin'), deleteZone);

module.exports = router;
