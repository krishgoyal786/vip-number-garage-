const mongoose = require('mongoose');

const partnerRequestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  program: { type: String, enum: ['Influencer', 'Business Reseller'], required: true },
  details: { type: String, required: true }, // Shop name, followers link, social profile, comments etc.
  date: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('PartnerRequest', partnerRequestSchema);
