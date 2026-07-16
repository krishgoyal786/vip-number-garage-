const mongoose = require('mongoose');

const sellRequestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  numberToSell: { type: String, required: true },
  price: { type: Number, required: true },
  date: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('SellRequest', sellRequestSchema);
