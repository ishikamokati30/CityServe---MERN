const express = require('express');
const router = express.Router();
const Shop = require('../models/Shop');
const Product = require('../models/Product');
const Service = require('../models/Service');
const Order = require('../models/Order');
const { protect, sellerOnly } = require('../middleware/auth');

// GET /api/owner/dashboard - stats overview
router.get('/dashboard', protect, sellerOnly, async (req, res) => {
  try {
    const shops = await Shop.find({ owner: req.user._id });
    const shopIds = shops.map(s => s._id);

    const productCount = await Product.countDocuments({ shop: { $in: shopIds } });
    const serviceCount = await Service.countDocuments({ shop: { $in: shopIds } });
    const orders = await Order.find({ shop: { $in: shopIds } });
    const totalRevenue = orders
      .filter(o => o.paymentStatus === 'paid' || o.paymentMode === 'cod')
      .reduce((sum, o) => sum + o.total, 0);
    const pendingOrders = orders.filter(o => o.status === 'pending').length;

    res.json({
      shopCount: shops.length,
      productCount,
      serviceCount,
      orderCount: orders.length,
      pendingOrders,
      totalRevenue: +totalRevenue.toFixed(2),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/owner/shops
router.get('/shops', protect, sellerOnly, async (req, res) => {
  try {
    const shops = await Shop.find({ owner: req.user._id }).populate('city', 'name state');
    res.json(shops);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/owner/orders - orders for seller's shops
router.get('/orders', protect, sellerOnly, async (req, res) => {
  try {
    const shops = await Shop.find({ owner: req.user._id });
    const shopIds = shops.map(s => s._id);
    const orders = await Order.find({ shop: { $in: shopIds } })
      .sort('-createdAt')
      .populate('user', 'name email phone')
      .populate('shop', 'name');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/owner/orders/:id/status - update order status
router.put('/orders/:id/status', protect, sellerOnly, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('shop');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.shop.owner.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });
    order.status = req.body.status;
    if (req.body.status === 'delivered' && order.paymentMode === 'cod') {
      order.paymentStatus = 'paid';
    }
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
