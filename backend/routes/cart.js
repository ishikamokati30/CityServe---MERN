const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

// Cart stored in user session as simple JSON in memory
// For production use a Cart model; here we return logic for frontend localStorage cart

// POST /api/cart/validate - validate products and return prices
router.post('/validate', protect, async (req, res) => {
  try {
    const { items } = req.body; // [{productId, quantity}]
    if (!items || !items.length) return res.json({ items: [], subtotal: 0 });
    const enriched = [];
    for (const item of items) {
      const product = await Product.findById(item.productId).populate('shop', 'name');
      if (product && product.isAvailable && product.stock >= item.quantity) {
        enriched.push({
          productId: product._id,
          name: product.name,
          image: product.image,
          price: product.price,
          discountPercent: product.discountPercent,
          discountedPrice: product.discountedPrice,
          shop: product.shop,
          quantity: item.quantity,
          lineTotal: +(product.discountedPrice * item.quantity).toFixed(2),
        });
      }
    }
    const subtotal = enriched.reduce((sum, i) => sum + i.lineTotal, 0);
    res.json({ items: enriched, subtotal: +subtotal.toFixed(2) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/cart/apply-coupon
router.post('/apply-coupon', protect, async (req, res) => {
  try {
    const Coupon = require('../models/Coupon');
    const { code, subtotal } = req.body;
    const coupon = await Coupon.findOne({ code: code?.toUpperCase(), active: true });
    if (!coupon) return res.status(404).json({ message: 'Invalid or expired coupon' });
    if (coupon.expiresAt && coupon.expiresAt < new Date())
      return res.status(400).json({ message: 'Coupon has expired' });
    if (subtotal < coupon.minOrderAmount)
      return res.status(400).json({ message: `Minimum order ₹${coupon.minOrderAmount} required` });
    const discount = +(subtotal * coupon.discountPercent / 100).toFixed(2);
    res.json({ discount, discountPercent: coupon.discountPercent, code: coupon.code });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
