const Route = require('../models/Route');
const Zone = require('../models/Zone');
const DailyRoute = require('../models/DailyRoute');
const handleError = require('../utils/handleError');

const FIELDS = ['name', 'zone', 'stops', 'isActive'];

exports.createRoute = async (req, res) => {
  try {
    const { name, zone, stops } = req.body;
    if (!(await Zone.exists({ _id: zone }))) {
      return res.status(404).json({ message: 'Zone not found' });
    }
    const route = await Route.create({ name, zone, stops });
    res.status(201).json(route);
  } catch (err) {
    handleError(res, err);
  }
};

exports.getRoutes = async (req, res) => {
  try {
    const filter = req.query.zone ? { zone: req.query.zone } : {};
    const routes = await Route.find(filter).sort('name').populate('zone', 'name');
    res.json(routes);
  } catch (err) {
    handleError(res, err);
  }
};

exports.getRoute = async (req, res) => {
  try {
    const route = await Route.findById(req.params.id).populate('zone', 'name');
    if (!route) return res.status(404).json({ message: 'Route not found' });
    res.json(route);
  } catch (err) {
    handleError(res, err);
  }
};

exports.updateRoute = async (req, res) => {
  try {
    const route = await Route.findById(req.params.id);
    if (!route) return res.status(404).json({ message: 'Route not found' });

    if (req.body.zone && !(await Zone.exists({ _id: req.body.zone }))) {
      return res.status(404).json({ message: 'Zone not found' });
    }
    FIELDS.forEach((f) => {
      if (req.body[f] !== undefined) route[f] = req.body[f];
    });
    await route.save();
    res.json(route);
  } catch (err) {
    handleError(res, err);
  }
};

exports.deleteRoute = async (req, res) => {
  try {
    if (await DailyRoute.exists({ route: req.params.id })) {
      return res.status(409).json({ message: 'Route is assigned in daily routes' });
    }
    const route = await Route.findByIdAndDelete(req.params.id);
    if (!route) return res.status(404).json({ message: 'Route not found' });
    res.json({ message: 'Route deleted' });
  } catch (err) {
    handleError(res, err);
  }
};
