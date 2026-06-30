const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  state: { type: String, required: true, trim: true },
  image: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('City', citySchema);
