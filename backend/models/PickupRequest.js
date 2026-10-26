const mongoose = require('mongoose');
const PRICES = require('../utils/pickupPrices');

const pickupSchema = new mongoose.Schema(
  {
    citizen: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    zone: { type: mongoose.Schema.Types.ObjectId, ref: 'Zone', required: true },
    wasteType: { type: String, enum: Object.keys(PRICES), required: true },
    description: { type: String, trim: true, maxlength: 500, default: '' },
    address: { type: String, required: true, trim: true },
    preferredDate: { type: Date, required: true },
    amount: { type: Number, required: true },
    paymentStatus: { type: String, enum: ['unpaid', 'paid'], default: 'unpaid' },
    status: {
      type: String,
      enum: ['requested', 'scheduled', 'completed', 'cancelled'],
      default: 'requested',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('PickupRequest', pickupSchema);
