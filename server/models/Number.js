const mongoose = require('mongoose');

const numberSchema = new mongoose.Schema({
  number: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  offerPrice: { type: Number }, // Optional discounted price
  category: { type: String, required: true },
  operator: { type: String, default: 'Airtel' }, // Jio, Airtel, Vi, BSNL
  description: { type: String, required: true },
  isSold: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Number', numberSchema);
