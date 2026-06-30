const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
  name: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true, min: 0 },
  discountPercent: { type: Number, default: 0, min: 0, max: 100 },
  stock: { type: Number, required: true, min: 0 },
  image: { type: String, default: '' },
  category: { type: String, default: '' },
  isAvailable: { type: Boolean, default: true },
}, { timestamps: true });

productSchema.virtual('discountedPrice').get(function () {
  if (this.discountPercent > 0) {
    return +(this.price * (100 - this.discountPercent) / 100).toFixed(2);
  }
  return this.price;
});

productSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);
