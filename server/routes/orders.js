const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { adminAuth, auth } = require('../middleware/auth');
const { sendNotification } = require('../utils/notifier');

// GET all orders (Admin Only)
router.get('/', adminAuth, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET user orders (Protected - Logged in users only)
router.get('/my', auth, async (req, res) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    const query = {
      $or: [
        { 'customer.phone': user.phone },
        { 'customer.email': user.email }
      ]
    };
    const orders = await Order.find(query).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST an order (Protected - Logged in users only)
router.post('/', auth, async (req, res) => {
  try {
    const NumberModel = require('../models/Number');
    const numberStrings = (req.body.items || []).map(i => i.number);

    // Verify if any of these numbers are already sold
    const soldNumbers = await NumberModel.find({ number: { $in: numberStrings }, isSold: true });
    if (soldNumbers.length > 0) {
      const soldList = soldNumbers.map(n => n.number).join(', ');
      return res.status(400).json({ message: `Checkout failed. The following number(s) are already sold out: ${soldList}. Please remove them from your cart.` });
    }

    const order = new Order({
      customer: req.body.customer,
      items: req.body.items,
      total: req.body.total,
      date: new Date().toLocaleString()
    });

    const newOrder = await order.save();
    
    // Mark purchased numbers as sold in inventory
    await NumberModel.updateMany({ number: { $in: numberStrings } }, { isSold: true });
    
    // Extract customer and order details for notifications
    const clientName = req.body.customer.name;
    const clientPhone = req.body.customer.phone;
    const numbersList = (req.body.items || []).map(i => i.number).join(', ');
    
    // 1. Customer Notification (SMS & WhatsApp)
    const customerMsg = `Hi ${clientName}, thank you for your order at VipNumberGarage! Your purchase for VIP Number(s): ${numbersList} (Total: ₹${(req.body.total || 0).toLocaleString()}) has been received successfully. We will generate and deliver your Unique Porting Code (UPC) and NOC transfer details via WhatsApp within 24-48 business hours. For any queries, feel free to visit our Bathinda office or WhatsApp support.`;
    
    // 2. Admin Alert (WhatsApp preferred)
    const adminPhone = process.env.ADMIN_ALERT_PHONE || "919855598544"; // Fallback admin number
    const adminMsg = `🔔 NEW ORDER ALERT: Client "${clientName}" (+91 ${clientPhone}) placed an order for VIP Number(s): [${numbersList}] totaling ₹${(req.body.total || 0).toLocaleString()}. Please check the admin dashboard to verify and upload the porting UPC.`;

    // Trigger alerts (non-blocking)
    sendNotification({ to: clientPhone, message: customerMsg, channels: ['sms', 'whatsapp'] }).catch(err => console.error("Customer notify error:", err));
    sendNotification({ to: adminPhone, message: adminMsg, channels: ['whatsapp'] }).catch(err => console.error("Admin notify error:", err));

    res.status(201).json(newOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// UPDATE order status (Admin Only)
router.patch('/:id', adminAuth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    
    if (req.body.status) order.status = req.body.status;
    if (req.body.items) order.items = req.body.items;
    
    const updatedOrder = await order.save();
    
    // If marked as Delivered, make sure numbers are marked as sold in catalog
    if (req.body.status === 'Delivered') {
      const NumberModel = require('../models/Number');
      const numberStrings = (order.items || []).map(i => i.number);
      await NumberModel.updateMany({ number: { $in: numberStrings } }, { isSold: true });
    }
    
    res.json(updatedOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE an order (Admin Only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: 'Order deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
