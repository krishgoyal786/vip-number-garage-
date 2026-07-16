const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customer: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    address: { type: String }
  },
  items: [
    {
      number: String,
      price: Number,
      category: String,
      upcCode: { type: String, default: '' }
    }
  ],
  total: { type: Number, required: true },
  status: { type: String, enum: ['Pending', 'Delivered'], default: 'Pending' },
  date: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
