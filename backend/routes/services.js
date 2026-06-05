const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const Shop = require('../models/Shop');
const { protect, sellerOnly } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const { shop } = req.query;
    const filter = shop ? { shop } : {};
    const services = await Service.find(filter).populate('shop', 'name');
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', protect, sellerOnly, async (req, res) => {
  try {
    const shop = await Shop.findById(req.body.shop);
    if (!shop || shop.owner.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized for this shop' });
    const service = await Service.create(req.body);
    res.status(201).json(service);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', protect, sellerOnly, async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).populate('shop');
    if (!service) return res.status(404).json({ message: 'Service not found' });
    if (service.shop.owner.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });
    const updated = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', protect, sellerOnly, async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).populate('shop');
    if (!service) return res.status(404).json({ message: 'Service not found' });
    if (service.shop.owner.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });
    await service.deleteOne();
    res.json({ message: 'Service deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
