const express = require('express');
const router = express.Router();
const Shop = require('../models/Shop');
const Product = require('../models/Product');
const Service = require('../models/Service');
const { protect, sellerOnly } = require('../middleware/auth');

// GET /api/shops?city=&category=&q=
router.get('/', async (req, res) => {
  try {
    const { city, category, q } = req.query;
    const filter = {};
    if (city) filter.city = city;
    if (category) filter.category = category;
    if (q) filter.$or = [
      { name: { $regex: q, $options: 'i' } },
      { category: { $regex: q, $options: 'i' } },
    ];
    const shops = await Shop.find(filter).populate('city', 'name state');
    res.json(shops);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/shops/:id
router.get('/:id', async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id).populate('city', 'name state').populate('owner', 'name email');
    if (!shop) return res.status(404).json({ message: 'Shop not found' });
    const products = await Product.find({ shop: shop._id, isAvailable: true });
    const services = await Service.find({ shop: shop._id, isAvailable: true });
    res.json({ shop, products, services });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/shops - seller creates shop
router.post('/', protect, sellerOnly, async (req, res) => {
  try {
    const shop = await Shop.create({ ...req.body, owner: req.user._id });
    res.status(201).json(shop);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/shops/:id - seller updates own shop
router.put('/:id', protect, sellerOnly, async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);
    if (!shop) return res.status(404).json({ message: 'Shop not found' });
    if (shop.owner.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });
    const updated = await Shop.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/shops/:id
router.delete('/:id', protect, sellerOnly, async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);
    if (!shop) return res.status(404).json({ message: 'Shop not found' });
    if (shop.owner.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });
    await shop.deleteOne();
    res.json({ message: 'Shop deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
