const mongoose = require('mongoose');

const numberSchema = new mongoose.Schema({
  number: { type: String, required: true, unique: true },
  cleanNumber: { type: String }, // Pre-computed digit-only string for indexing/search
  singleDigitSum: { type: Number }, // Pre-computed single-digit numerology sum
  price: { type: Number, required: true },
  offerPrice: { type: Number }, // Optional discounted price
  category: { type: String, required: true },
  operator: { type: String, default: 'Airtel' }, // Jio, Airtel, Vi, BSNL
  description: { type: String, required: true },
  isSold: { type: Boolean, default: false }
}, { timestamps: true });

// Pre-save hook to calculate cleanNumber and singleDigitSum automatically
numberSchema.pre('save', function() {
  if (this.number) {
    this.cleanNumber = this.number.replace(/\D/g, '');
    const sum = this.cleanNumber.split('').reduce((acc, d) => acc + parseInt(d), 0);
    this.singleDigitSum = sum === 0 ? 0 : (sum - 1) % 9 + 1;
  }
});

module.exports = mongoose.model('Number', numberSchema);
