const express = require('express');
const router = express.Router();
const PartnerRequest = require('../models/PartnerRequest');
const { adminAuth } = require('../middleware/auth');

// GET all partner inquiries (Admin Only)
router.get('/', adminAuth, async (req, res) => {
  try {
    const partnerRequests = await PartnerRequest.find().sort({ createdAt: -1 });
    res.json(partnerRequests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new partner inquiry (Public)
router.post('/', async (req, res) => {
  const newPartnerReq = new PartnerRequest({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    program: req.body.program,
    details: req.body.details,
    date: new Date().toLocaleString()
  });

  try {
    const savedPartnerReq = await newPartnerReq.save();
    res.status(201).json(savedPartnerReq);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a partner inquiry (Admin Only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const deletedReq = await PartnerRequest.findByIdAndDelete(req.params.id);
    if (!deletedReq) return res.status(404).json({ message: 'Request not found' });
    res.json({ message: 'Inquiry deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
