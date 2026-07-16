const express = require('express');
const router = express.Router();
const Activity = require('../models/Activity');
const { adminAuth } = require('../middleware/auth');

// GET all activity (Admin Only)
router.get('/', adminAuth, async (req, res) => {
  try {
    const activities = await Activity.find().sort({ createdAt: -1 }).limit(100);
    res.json(activities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new activity log (Public)
router.post('/', async (req, res) => {
  const activity = new Activity({
    user: req.body.user,
    action: req.body.action,
    details: req.body.details,
    date: new Date().toLocaleString()
  });

  try {
    const savedLog = await activity.save();
    res.status(201).json(savedLog);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
