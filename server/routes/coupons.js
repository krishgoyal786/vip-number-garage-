const express = require('express');
const router = express.Router();
const Coupon = require('../models/Coupon');
const { adminAuth } = require('../middleware/auth');

// GET all coupons (Admin Only)
router.get('/', adminAuth, async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json(coupons);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new coupon (Admin Only)
router.post('/', adminAuth, async (req, res) => {
  const newCoupon = new Coupon({
    code: req.body.code,
    discountPercentage: req.body.discountPercentage,
    isActive: req.body.isActive !== undefined ? req.body.isActive : true
  });

  try {
    const savedCoupon = await newCoupon.save();
    res.status(201).json(savedCoupon);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a coupon (Admin Only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const deletedCoupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!deletedCoupon) return res.status(404).json({ message: 'Coupon not found' });
    res.json({ message: 'Coupon deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST validate coupon (Public)
router.post('/validate', async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ valid: false, message: 'Coupon code is required' });

    const coupon = await Coupon.findOne({ code: code.toUpperCase().trim(), isActive: true });
    if (!coupon) {
      return res.status(404).json({ valid: false, message: 'Invalid or expired coupon code' });
    }

    res.json({
      valid: true,
      code: coupon.code,
      discountPercentage: coupon.discountPercentage
    });
  } catch (err) {
    res.status(500).json({ valid: false, message: err.message });
  }
});

module.exports = router;
