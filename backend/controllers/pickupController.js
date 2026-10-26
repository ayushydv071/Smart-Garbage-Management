const PickupRequest = require('../models/PickupRequest');
const Zone = require('../models/Zone');
const PRICES = require('../utils/pickupPrices');
const handleError = require('../utils/handleError');

exports.createPickup = async (req, res) => {
  try {
    const { zone, wasteType, description, address, preferredDate } = req.body;

    if (!zone || !wasteType || !address || !preferredDate) {
      return res.status(400).json({ message: 'zone, wasteType, address and preferredDate are required' });
    }
    if (!PRICES[wasteType]) {
      return res.status(400).json({ message: 'Invalid waste type' });
    }

    const date = new Date(preferredDate);
    if (isNaN(date)) return res.status(400).json({ message: 'Invalid date' });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) {
      return res.status(400).json({ message: 'Preferred date cannot be in the past' });
    }

    if (!(await Zone.exists({ _id: zone }))) {
      return res.status(404).json({ message: 'Zone not found' });
    }

    const pickup = await PickupRequest.create({
      citizen: req.user._id,
      zone,
      wasteType,
      description,
      address,
      preferredDate: date,
      amount: PRICES[wasteType],
    });
    res.status(201).json(pickup);
  } catch (err) {
    handleError(res, err);
  }
};

exports.getPickups = async (req, res) => {
  try {
    const filter = {};
    if (req.user.role === 'citizen') filter.citizen = req.user._id;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.zone) filter.zone = req.query.zone;

    const list = await PickupRequest.find(filter)
      .sort('-createdAt')
      .populate('zone', 'name')
      .populate('citizen', 'name email');
    res.json(list);
  } catch (err) {
    handleError(res, err);
  }
};

exports.getPickup = async (req, res) => {
  try {
    const pickup = await PickupRequest.findById(req.params.id)
      .populate('zone', 'name')
      .populate('citizen', 'name email');
    if (!pickup) return res.status(404).json({ message: 'Pickup request not found' });

    if (req.user.role === 'citizen' && String(pickup.citizen._id) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Forbidden: this is not your request' });
    }
    res.json(pickup);
  } catch (err) {
    handleError(res, err);
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!PickupRequest.schema.path('status').enumValues.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const pickup = await PickupRequest.findById(req.params.id);
    if (!pickup) return res.status(404).json({ message: 'Pickup request not found' });

    if (['completed', 'cancelled'].includes(pickup.status)) {
      return res.status(409).json({ message: 'This request is already closed' });
    }

    pickup.status = status;
    await pickup.save();
    res.json(pickup);
  } catch (err) {
    handleError(res, err);
  }
};

exports.cancelPickup = async (req, res) => {
  try {
    const pickup = await PickupRequest.findById(req.params.id);
    if (!pickup) return res.status(404).json({ message: 'Pickup request not found' });

    if (String(pickup.citizen) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Forbidden: this is not your request' });
    }
    if (pickup.status !== 'requested') {
      return res.status(409).json({ message: 'Only requested pickups can be cancelled' });
    }

    pickup.status = 'cancelled';
    await pickup.save();
    res.json(pickup);
  } catch (err) {
    handleError(res, err);
  }
};
