const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema(
  {
    citizen: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    zone: { type: mongoose.Schema.Types.ObjectId, ref: 'Zone', required: true },
    title: { type: String, required: true, trim: true, maxlength: 100 },
    description: { type: String, required: true, trim: true, maxlength: 1000 },
    category: {
      type: String,
      enum: ['overflowing_bin', 'illegal_dumping', 'missed_pickup', 'other'],
      default: 'other',
    },
    location: {
      lat: Number,
      lng: Number,
      address: { type: String, trim: true },
    },
    photo: { type: String, default: '' },
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'resolved', 'rejected'],
      default: 'pending',
    },
    adminNote: { type: String, trim: true, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Complaint', complaintSchema);
