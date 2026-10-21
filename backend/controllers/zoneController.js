const Zone = require('../models/Zone');
const Route = require('../models/Route');
const handleError = require('../utils/handleError');

const FIELDS = ['name', 'description', 'center', 'isActive'];

exports.createZone = async (req, res) => {
  try {
    const { name, description, center } = req.body;
    const zone = await Zone.create({ name, description, center });
    res.status(201).json(zone);
  } catch (err) {
    handleError(res, err);
  }
};

exports.getZones = async (req, res) => {
  try {
    const zones = await Zone.find().sort('name');
    res.json(zones);
  } catch (err) {
    handleError(res, err);
  }
};

exports.getZone = async (req, res) => {
  try {
    const zone = await Zone.findById(req.params.id);
    if (!zone) return res.status(404).json({ message: 'Zone not found' });
    res.json(zone);
  } catch (err) {
    handleError(res, err);
  }
};

exports.updateZone = async (req, res) => {
  try {
    const zone = await Zone.findById(req.params.id);
    if (!zone) return res.status(404).json({ message: 'Zone not found' });

    FIELDS.forEach((f) => {
      if (req.body[f] !== undefined) zone[f] = req.body[f];
    });
    await zone.save();
    res.json(zone);
  } catch (err) {
    handleError(res, err);
  }
};

exports.deleteZone = async (req, res) => {
  try {
    if (await Route.exists({ zone: req.params.id })) {
      return res.status(409).json({ message: 'Zone has routes, delete them first' });
    }
    const zone = await Zone.findByIdAndDelete(req.params.id);
    if (!zone) return res.status(404).json({ message: 'Zone not found' });
    res.json({ message: 'Zone deleted' });
  } catch (err) {
    handleError(res, err);
  }
};
