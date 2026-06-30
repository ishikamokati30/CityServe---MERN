const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Product = require('../models/Product');
const Shop = require('../models/Shop');
const { protect, sellerOnly } = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `product_${Date.now()}${path.extname(file.originalname)}`),
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// GET /api/products?shop=&category=&q=
router.get('/', async (req, res) => {
  try {
    const { shop, category, q } = req.query;
    const filter = {};
    if (shop) filter.shop = shop;
    if (category) filter.category = category;
    if (q) filter.name = { $regex: q, $options: 'i' };
    const products = await Product.find(filter).populate('shop', 'name');
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('shop');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/products - seller adds product
router.post('/', protect, sellerOnly, upload.single('image'), async (req, res) => {
  try {
    const shop = await Shop.findById(req.body.shop);
    if (!shop || shop.owner.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized for this shop' });
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';
    const product = await Product.create({ ...req.body, image: imageUrl });
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/products/:id
router.put('/:id', protect, sellerOnly, upload.single('image'), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('shop');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.shop.owner.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : product.image;
    const updated = await Product.findByIdAndUpdate(req.params.id, { ...req.body, image: imageUrl }, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/products/:id
router.delete('/:id', protect, sellerOnly, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('shop');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.shop.owner.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });
    await product.deleteOne();
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
