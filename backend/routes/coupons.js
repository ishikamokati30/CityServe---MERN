const express = require('express');
const router = express.Router();
const Coupon = require('../models/Coupon');
const { protect, sellerOnly } = require('../middleware/auth');

// GET /api/coupons - seller-only coupon list
router.get('/', protect, sellerOnly, async (req, res) => {
  try {
    const coupons = await Coupon.find().sort('-createdAt');
    res.json(coupons);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/coupons - create a coupon
router.post('/', protect, sellerOnly, async (req, res) => {
  try {
    const coupon = await Coupon.create({
      code: (req.body.code || '').toUpperCase(),
      discountPercent: req.body.discountPercent,
      minOrderAmount: req.body.minOrderAmount || 0,
      active: req.body.active !== false,
      expiresAt: req.body.expiresAt || null,
    });
    res.status(201).json(coupon);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
