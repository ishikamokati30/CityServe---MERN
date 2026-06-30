const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true },
  discountPercent: { type: Number, required: true, min: 1, max: 100 },
  active: { type: Boolean, default: true },
  minOrderAmount: { type: Number, default: 0 },
  expiresAt: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Coupon', couponSchema);
