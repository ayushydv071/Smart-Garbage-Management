const express = require('express');
const { signup, login, getMe } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', protect, getMe);

// temporary test routes, Step 5 ke baad hata dena
router.get('/admin-test', protect, authorize('admin'), (req, res) =>
  res.json({ message: `Hello admin ${req.user.name}` })
);
router.get('/staff-test', protect, authorize('staff', 'admin'), (req, res) =>
  res.json({ message: `Hello ${req.user.role} ${req.user.name}` })
);

module.exports = router;
