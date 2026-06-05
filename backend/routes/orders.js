const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

// POST /api/orders - place order
router.post('/', protect, async (req, res) => {
  try {
    const { items, deliveryOption, deliveryAddress, paymentMode, subtotal, discount, deliveryCharge, total, couponCode } = req.body;
    if (!items || !items.length) return res.status(400).json({ message: 'No items in order' });

    // Snapshot product details
    const orderItems = [];
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) return res.status(400).json({ message: `Product not found: ${item.productId}` });
      if (product.stock < item.quantity) return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.discountedPrice,
        image: product.image,
        quantity: item.quantity,
      });
      // Deduct stock
      product.stock -= item.quantity;
      await product.save();
    }

    const shopId = (await Product.findById(items[0].productId))?.shop;

    const order = await Order.create({
      user: req.user._id,
      shop: shopId,
      items: orderItems,
      deliveryOption,
      deliveryAddress,
      paymentMode,
      paymentStatus: paymentMode === 'cod' ? 'pending' : 'pending',
      subtotal,
      discount,
      deliveryCharge,
      total,
      couponCode,
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/orders - buyer's orders
router.get('/', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort('-createdAt').populate('shop', 'name');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/orders/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('shop', 'name contact');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/orders/:id/cancel
router.put('/:id/cancel', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.user.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not authorized' });
    if (['delivered', 'cancelled'].includes(order.status))
      return res.status(400).json({ message: 'Cannot cancel this order' });
    order.status = 'cancelled';
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
