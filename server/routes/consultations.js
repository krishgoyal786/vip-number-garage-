const express = require('express');
const router = express.Router();
const Consultation = require('../models/Consultation');
const { adminAuth, auth } = require('../middleware/auth');
const { sendNotification } = require('../utils/notifier');

// GET all consultations (Admin Only)
router.get('/', adminAuth, async (req, res) => {
  try {
    const consultations = await Consultation.find().sort({ createdAt: -1 });
    res.json(consultations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET all booked slots (Public - for checking availability)
router.get('/booked-slots', async (req, res) => {
  try {
    const booked = await Consultation.find(
      { status: { $ne: 'Cancelled' } },
      'bookingDate bookingSlot'
    );
    res.json(booked);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new consultation request (Protected - Logged in users only)
router.post('/', auth, async (req, res) => {
  const consultation = new Consultation({
    customerName: req.body.customerName,
    phone: req.body.phone,
    email: req.body.email,
    dateOfBirth: req.body.dateOfBirth,
    timeOfBirth: req.body.timeOfBirth,
    placeOfBirth: req.body.placeOfBirth,
    bookingDate: req.body.bookingDate,
    bookingSlot: req.body.bookingSlot,
    paymentStatus: req.body.paymentStatus || 'Pending',
    paymentId: req.body.paymentId,
    status: req.body.status || 'Scheduled',
    pricePaid: req.body.pricePaid || 499
  });

  try {
    // Prevent double booking of the exact same slot
    const existingBooking = await Consultation.findOne({
      bookingDate: req.body.bookingDate,
      bookingSlot: req.body.bookingSlot,
      status: { $ne: 'Cancelled' }
    });

    if (existingBooking) {
      return res.status(400).json({ message: "This slot is already booked. Please choose another date or time slot." });
    }

    const newConsultation = await consultation.save();
    
    // Trigger notifications for new Astro booking
    const clientName = req.body.customerName;
    const clientPhone = req.body.phone;
    const date = req.body.bookingDate;
    const slot = req.body.bookingSlot;

    // 1. Customer Notification (SMS & WhatsApp)
    const customerMsg = `Hi ${clientName}, your Astro-Numerology consultation with VipNumberGarage has been successfully booked for ${date} at ${slot}. Our expert astrologer will connect with you directly on this WhatsApp number at the scheduled time. Thank you for choosing us.`;

    // 2. Admin / Astrologer Alert (WhatsApp preferred)
    const adminPhone = process.env.ADMIN_ALERT_PHONE || "919855598544";
    const adminMsg = `🔮 NEW ASTRO CONSULTATION BOOKING: Client "${clientName}" (+91 ${clientPhone}) booked a 30-min slot on ${date} at ${slot}. Birth Coordinates: DoB: ${req.body.dateOfBirth}, Time: ${req.body.timeOfBirth}, Place: ${req.body.placeOfBirth}. Check the admin dashboard to prepare charts.`;

    // Trigger alerts (non-blocking)
    sendNotification({ to: clientPhone, message: customerMsg, channels: ['sms', 'whatsapp'] }).catch(err => console.error("Astro customer notify error:", err));
    sendNotification({ to: adminPhone, message: adminMsg, channels: ['whatsapp'] }).catch(err => console.error("Astro admin notify error:", err));

    res.status(201).json(newConsultation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// UPDATE consultation status & schedule (Admin Only)
router.patch('/:id', adminAuth, async (req, res) => {
  try {
    const consultation = await Consultation.findById(req.params.id);
    if (!consultation) return res.status(404).json({ message: 'Consultation not found' });

    if (req.body.status) consultation.status = req.body.status;
    if (req.body.paymentStatus) consultation.paymentStatus = req.body.paymentStatus;
    if (req.body.bookingDate) consultation.bookingDate = req.body.bookingDate;
    if (req.body.bookingSlot) consultation.bookingSlot = req.body.bookingSlot;
    
    const updatedConsultation = await consultation.save();
    res.json(updatedConsultation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a consultation request (Admin Only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const consultation = await Consultation.findById(req.params.id);
    if (!consultation) return res.status(404).json({ message: 'Consultation not found' });

    await Consultation.findByIdAndDelete(req.params.id);
    res.json({ message: 'Consultation deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
