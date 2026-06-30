const mongoose = require('mongoose');
require('dotenv').config();

const City = require('./models/City');
const Coupon = require('./models/Coupon');

const cities = [
  { name: 'Hyderabad', state: 'Telangana' },
  { name: 'Mumbai', state: 'Maharashtra' },
  { name: 'Bangalore', state: 'Karnataka' },
  { name: 'Delhi', state: 'Delhi' },
  { name: 'Chennai', state: 'Tamil Nadu' },
  { name: 'Pune', state: 'Maharashtra' },
  { name: 'Kolkata', state: 'West Bengal' },
  { name: 'Ahmedabad', state: 'Gujarat' },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/cityserve');
    console.log('✅ Connected to MongoDB');

    await City.deleteMany({});
    await City.insertMany(cities);
    console.log(`✅ ${cities.length} cities seeded`);

    await Coupon.deleteMany({});
    await Coupon.create([
      { code: 'WELCOME20', discountPercent: 20, minOrderAmount: 200, active: true },
      { code: 'SAVE50', discountPercent: 10, minOrderAmount: 500, active: true },
    ]);
    console.log('✅ Coupons seeded: WELCOME20, SAVE50');

    console.log('🎉 Seed complete!');
  } catch (err) {
    console.error('❌ Seed error:', err.message);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
