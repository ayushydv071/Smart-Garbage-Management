const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const { createRoute, getRoutes, getRoute, updateRoute, deleteRoute } = require('../controllers/routeController');

const router = express.Router();
router.use(protect);

router.get('/', getRoutes);
router.get('/:id', getRoute);
router.post('/', authorize('admin'), createRoute);
router.put('/:id', authorize('admin'), updateRoute);
router.delete('/:id', authorize('admin'), deleteRoute);

module.exports = router;
