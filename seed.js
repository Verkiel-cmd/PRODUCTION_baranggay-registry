const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const Admin = require('./models/admin');

async function seed() {
  await mongoose.connect(process.env.ATLAS_URL);

  const hashedPassword = await bcrypt.hash('admin123', 10);
  // 10 = salt rounds — how hard it is to brute-force

  await Admin.findOneAndUpdate(
    { username: 'admin' },
    { username: 'admin', password: hashedPassword },
    { upsert: true }
  );
  // findOneAndUpdate + upsert = creates if doesn't exist, updates if it does

  console.log('Admin user seeded!');
  await mongoose.disconnect();
}

seed();