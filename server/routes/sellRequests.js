const express = require('express');
const router = express.Router();
const SellRequest = require('../models/SellRequest');
const { adminAuth } = require('../middleware/auth');
const { sendNotification } = require('../utils/notifier');

// GET all sell requests (Admin Only)
router.get('/', adminAuth, async (req, res) => {
  try {
    const sellRequests = await SellRequest.find().sort({ createdAt: -1 });
    res.json(sellRequests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new sell request (Public)
router.post('/', async (req, res) => {
  const newSellReq = new SellRequest({
    name: req.body.name,
    phone: req.body.phone,
    numberToSell: req.body.numberToSell,
    price: req.body.price,
    date: new Date().toLocaleString()
  });

  try {
    const savedSellReq = await newSellReq.save();
    
    // Trigger notification to admin
    const adminPhone = process.env.ADMIN_ALERT_PHONE || "919855598544";
    const adminMsg = `🤝 NEW SELL REQUEST: Seller "${req.body.name}" (+91 ${req.body.phone}) wants to list their VIP number: ${req.body.numberToSell} for expected price: ₹${Number(req.body.price).toLocaleString()}. Please check the admin dashboard to review and approve.`;

    sendNotification({ to: adminPhone, message: adminMsg, channels: ['whatsapp'] }).catch(err => console.error("Admin sell notify error:", err));

    res.status(201).json(savedSellReq);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a sell request (Admin Only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const sellReq = await SellRequest.findByIdAndDelete(req.params.id);
    if (!sellReq) return res.status(404).json({ message: 'Request not found' });
    res.json({ message: 'Sell request deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
