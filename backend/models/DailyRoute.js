const mongoose = require('mongoose');

const dailyRouteSchema = new mongoose.Schema(
  {
    route: { type: mongoose.Schema.Types.ObjectId, ref: 'Route', required: true },
    staff: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ['pending', 'in_progress', 'completed'], default: 'pending' },
  },
  { timestamps: true }
);

// one route can be assigned only once per day
dailyRouteSchema.index({ route: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('DailyRoute', dailyRouteSchema);
