const fs = require('fs');
const path = require('path');
const Complaint = require('../models/Complaint');
const Zone = require('../models/Zone');
const handleError = require('../utils/handleError');

const removePhoto = (photo) => {
  if (!photo) return;
  fs.unlink(path.join(__dirname, '..', photo), () => {});
};

exports.createComplaint = async (req, res) => {
  const uploaded = req.file ? `/uploads/${req.file.filename}` : '';
  try {
    const { title, description, category, zone, lat, lng, address } = req.body;

    if (!title || !description || !zone) {
      removePhoto(uploaded);
      return res.status(400).json({ message: 'title, description and zone are required' });
    }
    if (!(await Zone.exists({ _id: zone }))) {
      removePhoto(uploaded);
      return res.status(404).json({ message: 'Zone not found' });
    }

    const complaint = await Complaint.create({
      citizen: req.user._id,
      zone,
      title,
      description,
      category,
      location: { lat, lng, address },
      photo: uploaded,
    });
    res.status(201).json(complaint);
  } catch (err) {
    removePhoto(uploaded);
    handleError(res, err);
  }
};

exports.getComplaints = async (req, res) => {
  try {
    const filter = {};
    if (req.user.role === 'citizen') filter.citizen = req.user._id;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.zone) filter.zone = req.query.zone;

    const list = await Complaint.find(filter)
      .sort('-createdAt')
      .populate('zone', 'name')
      .populate('citizen', 'name email');
    res.json(list);
  } catch (err) {
    handleError(res, err);
  }
};

exports.getComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('zone', 'name')
      .populate('citizen', 'name email');
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    if (req.user.role === 'citizen' && String(complaint.citizen._id) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Forbidden: this is not your complaint' });
    }
    res.json(complaint);
  } catch (err) {
    handleError(res, err);
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status, adminNote } = req.body;
    if (!Complaint.schema.path('status').enumValues.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    complaint.status = status;
    if (adminNote !== undefined) complaint.adminNote = adminNote;
    await complaint.save();
    res.json(complaint);
  } catch (err) {
    handleError(res, err);
  }
};

exports.deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    if (req.user.role === 'citizen') {
      if (String(complaint.citizen) !== String(req.user._id)) {
        return res.status(403).json({ message: 'Forbidden: this is not your complaint' });
      }
      if (complaint.status !== 'pending') {
        return res.status(403).json({ message: 'Only pending complaints can be deleted' });
      }
    }

    removePhoto(complaint.photo);
    await complaint.deleteOne();
    res.json({ message: 'Complaint deleted' });
  } catch (err) {
    handleError(res, err);
  }
};
