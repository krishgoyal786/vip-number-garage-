const mongoose = require('mongoose');

const consultationSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  dateOfBirth: { type: String, required: true },
  timeOfBirth: { type: String, required: true },
  placeOfBirth: { type: String, required: true },
  bookingDate: { type: String, required: true },
  bookingSlot: { type: String, required: true },
  paymentStatus: { type: String, default: 'Pending' }, // Pending, Paid
  paymentId: { type: String }, // Razorpay transaction ID
  status: { type: String, default: 'Scheduled' }, // Scheduled, Completed, Cancelled
  pricePaid: { type: Number, default: 499 }
}, { timestamps: true });

module.exports = mongoose.model('Consultation', consultationSchema);
