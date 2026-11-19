const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('API is running...');
});

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    uptime: Math.round(process.uptime()),
  });
});

app.use('/auth', require('./routes/authRoutes'));
app.use('/zones', require('./routes/zoneRoutes'));
app.use('/routes', require('./routes/routeRoutes'));
app.use('/daily-routes', require('./routes/dailyRouteRoutes'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/complaints', require('./routes/complaintRoutes'));
app.use('/pickups', require('./routes/pickupRoutes'));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.error('❌ MongoDB Error:', err));

// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
