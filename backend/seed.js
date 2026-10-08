require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const accounts = [
  { name: 'Admin', email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD, role: 'admin' },
  { name: 'Staff One', email: process.env.STAFF_EMAIL, password: process.env.STAFF_PASSWORD, role: 'staff' },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    for (const acc of accounts) {
      if (!acc.email || !acc.password) {
        console.log(`Skipping ${acc.role}: missing values in .env`);
        continue;
      }

      const exists = await User.findOne({ email: acc.email.toLowerCase() });
      if (exists) {
        console.log(`${acc.role} already exists: ${acc.email}`);
        continue;
      }

      const hashed = await bcrypt.hash(acc.password, 10);
      await User.create({ ...acc, password: hashed });
      console.log(`Created ${acc.role}: ${acc.email}`);
    }
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

seed();
