const express = require('express');
const router = express.Router();
const Request = require('../models/Request');
const { adminAuth } = require('../middleware/auth');

// GET all requests (Admin Only)
router.get('/', adminAuth, async (req, res) => {
  try {
    const requests = await Request.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new request (Public)
router.post('/', async (req, res) => {
  const newReq = new Request({
    name: req.body.name,
    phone: req.body.phone,
    pattern: req.body.pattern,
    budget: req.body.budget,
    date: new Date().toLocaleString(),
    status: 'Pending'
  });

  try {
    const savedReq = await newReq.save();
    res.status(201).json(savedReq);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PATCH update status (Admin Only)
router.patch('/:id', adminAuth, async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found" });

    if (req.body.status) {
      request.status = req.body.status;
    }
    const updated = await request.save();
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a request (Admin Only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const request = await Request.findByIdAndDelete(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found" });
    res.json({ message: "Request deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
