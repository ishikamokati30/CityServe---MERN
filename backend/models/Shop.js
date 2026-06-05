const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  city: { type: mongoose.Schema.Types.ObjectId, ref: 'City', required: true },
  name: { type: String, required: true, trim: true },
  category: { type: String, required: true },
  contact: { type: String, required: true },
  address: { type: String },
  description: { type: String, default: '' },
  image: { type: String, default: '' },
  openTime: { type: String, default: '09:00' },
  closeTime: { type: String, default: '21:00' },
  isActive: { type: Boolean, default: true },
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
}, { timestamps: true });

shopSchema.virtual('isOpen').get(function () {
  const now = new Date();
  const cur = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
  return cur >= this.openTime && cur <= this.closeTime;
});

shopSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Shop', shopSchema);
