const express = require('express');
const router = express.Router();
const Query = require('../models/Query');
const { adminAuth } = require('../middleware/auth');

// GET all queries (Admin Only)
router.get('/', adminAuth, async (req, res) => {
  try {
    const queries = await Query.find().sort({ createdAt: -1 });
    res.json(queries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a query (Public)
router.post('/', async (req, res) => {
  const query = new Query({
    name: req.body.name,
    email: req.body.email,
    message: req.body.message,
    date: new Date().toLocaleString(),
    status: 'Pending'
  });

  try {
    const newQuery = await query.save();
    res.status(201).json(newQuery);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PATCH update status (Admin Only)
router.patch('/:id', adminAuth, async (req, res) => {
  try {
    const query = await Query.findById(req.params.id);
    if (!query) return res.status(404).json({ message: "Query not found" });

    if (req.body.status) {
      query.status = req.body.status;
    }
    const updated = await query.save();
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a query (Admin Only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const query = await Query.findByIdAndDelete(req.params.id);
    if (!query) return res.status(404).json({ message: "Query not found" });
    res.json({ message: "Query deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
