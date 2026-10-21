const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const { assignDailyRoute, getDailyRoutes, updateStatus } = require('../controllers/dailyRouteController');

const router = express.Router();
router.use(protect);

router.get('/', authorize('staff', 'admin'), getDailyRoutes);
router.post('/', authorize('admin'), assignDailyRoute);
router.patch('/:id/status', authorize('staff', 'admin'), updateStatus);

module.exports = router;
