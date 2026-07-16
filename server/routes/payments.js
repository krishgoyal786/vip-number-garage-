const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { auth } = require('../middleware/auth');

// Initialize Razorpay
let razorpay;
const hasValidKeys = process.env.RAZORPAY_KEY_ID && 
                     process.env.RAZORPAY_KEY_ID !== 'YOUR_RAZORPAY_KEY_ID' &&
                     process.env.RAZORPAY_KEY_SECRET && 
                     process.env.RAZORPAY_KEY_SECRET !== 'YOUR_RAZORPAY_KEY_SECRET';

if (hasValidKeys) {
  try {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  } catch (err) {
    console.error("Failed to initialize Razorpay:", err.message);
  }
}

// CREATE RAZORPAY ORDER
router.post('/create-order', auth, async (req, res) => {
  const { amount } = req.body; 

  const isMockMode = !razorpay || !process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID === 'YOUR_RAZORPAY_KEY_ID';

  if (isMockMode) {
    return res.json({
      id: `order_mock_${Date.now()}`,
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: { mode: "test" }
    });
  }

  const options = {
    amount: amount * 100, // Convert to Paise
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
  };

  try {
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    console.error("Razorpay Order Error:", err);
    res.status(500).json({ message: "Could not create Razorpay order." });
  }
});

// VERIFY PAYMENT (Optional but highly recommended)
router.post('/verify', auth, async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const isMockMode = !razorpay || !process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID === 'YOUR_RAZORPAY_KEY_ID';

  if (isMockMode || (razorpay_order_id && razorpay_order_id.startsWith('order_mock_'))) {
    return res.status(200).json({ message: "Payment verified successfully (Test Mode)" });
  }

  const sign = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSign = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(sign.toString())
    .digest("hex");

  if (razorpay_signature === expectedSign) {
    return res.status(200).json({ message: "Payment verified successfully" });
  } else {
    return res.status(400).json({ message: "Invalid signature sent!" });
  }
});

module.exports = router;
