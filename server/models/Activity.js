const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  user: {
    name: { type: String, default: 'Guest' },
    phone: { type: String, default: 'Anonymous' }
  },
  action: { type: String, required: true }, // e.g., "Searched for 786", "Added 99999-00007 to Cart"
  details: { type: String },
  date: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Activity', activitySchema);
