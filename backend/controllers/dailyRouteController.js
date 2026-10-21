const DailyRoute = require('../models/DailyRoute');
const Route = require('../models/Route');
const User = require('../models/User');
const handleError = require('../utils/handleError');

exports.assignDailyRoute = async (req, res) => {
  try {
    const { route, staff, date } = req.body;
    if (!route || !staff || !date) {
      return res.status(400).json({ message: 'route, staff and date are required' });
    }

    const day = new Date(date);
    if (isNaN(day)) return res.status(400).json({ message: 'Invalid date' });

    if (!(await Route.exists({ _id: route }))) {
      return res.status(404).json({ message: 'Route not found' });
    }
    const staffUser = await User.findById(staff);
    if (!staffUser || staffUser.role !== 'staff') {
      return res.status(400).json({ message: 'Staff user not found' });
    }

    const daily = await DailyRoute.create({ route, staff, date: day });
    res.status(201).json(daily);
  } catch (err) {
    handleError(res, err);
  }
};

exports.getDailyRoutes = async (req, res) => {
  try {
    const filter = {};
    // staff can see only their own assignments
    if (req.user.role === 'staff') filter.staff = req.user._id;

    if (req.query.date) {
      const day = new Date(req.query.date);
      if (isNaN(day)) return res.status(400).json({ message: 'Invalid date' });
      filter.date = day;
    }

    const list = await DailyRoute.find(filter)
      .sort('-date')
      .populate('route', 'name stops')
      .populate('staff', 'name email');
    res.json(list);
  } catch (err) {
    handleError(res, err);
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'in_progress', 'completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const daily = await DailyRoute.findById(req.params.id);
    if (!daily) return res.status(404).json({ message: 'Daily route not found' });

    if (req.user.role === 'staff' && String(daily.staff) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Forbidden: this is not your route' });
    }

    daily.status = status;
    await daily.save();
    res.json(daily);
  } catch (err) {
    handleError(res, err);
  }
};
