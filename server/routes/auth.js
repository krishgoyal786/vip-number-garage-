const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const Otp = require('../models/Otp');

// 1. Send OTP to email
router.post('/send-otp', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  // Generate a random 4-digit OTP
  const otp = Math.floor(1000 + Math.random() * 9000).toString();

  try {
    // Save OTP to database (upsert to overwrite if already exists)
    await Otp.findOneAndUpdate(
      { email },
      { otp, createdAt: new Date() },
      { upsert: true, new: true }
    );

    // Retrieve email credentials
    const smtpHost = process.env.EMAIL_HOST;
    const smtpPort = process.env.EMAIL_PORT;
    const smtpUser = process.env.EMAIL_USER;
    const smtpPass = process.env.EMAIL_PASS;

    if (smtpHost && smtpUser && smtpPass) {
      console.log(`[SMTP Debug] Host: ${smtpHost}, Port: ${smtpPort}, User: ${smtpUser}, Pass Length: ${smtpPass.length}`);
      // Create Nodemailer Transporter
      let transportConfig = {
        host: smtpHost,
        port: parseInt(smtpPort || '587'),
        secure: smtpPort === '465',
        auth: {
          user: smtpUser,
          pass: smtpPass
        }
      };

      if (smtpHost.includes('gmail.com')) {
        transportConfig = {
          service: 'gmail',
          auth: {
            user: smtpUser,
            pass: smtpPass
          }
        };
      }

      const transporter = nodemailer.createTransport(transportConfig);

      const mailOptions = {
        from: `"VipNumberGarage" <${smtpUser}>`,
        to: email,
        subject: 'Your Login OTP - VipNumberGarage',
        text: `Your login OTP is ${otp}. It is valid for 5 minutes.`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #d4af37; border-radius: 10px;">
            <h2 style="color: #d4af37; text-align: center;">VipNumberGarage</h2>
            <p>Hello,</p>
            <p>Use the following One-Time Password (OTP) to complete your login/registration. This OTP is valid for 5 minutes:</p>
            <div style="font-size: 24px; font-weight: bold; text-align: center; margin: 20px 0; color: #333; background: #f9f9f9; padding: 10px; border-radius: 5px; border: 1px dashed #d4af37; letter-spacing: 5px;">
              ${otp}
            </div>
            <p style="font-size: 12px; color: #666; text-align: center;">If you didn't request this, you can safely ignore this email.</p>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
      console.log(`✉️ OTP email sent successfully to ${email}`);
      res.json({ message: 'OTP sent successfully to email' });
    } else {
      // Fallback Mode (Console logging for testing and cost saving during development)
      console.log(`\n========================================`);
      console.log(`📧 SIMULATED EMAIL OTP`);
      console.log(`To: ${email}`);
      console.log(`OTP: ${otp}`);
      console.log(`========================================\n`);
      
      res.json({ 
        message: 'OTP sent successfully (Simulated mode)', 
        simulated: true,
        otp: process.env.NODE_ENV === 'production' ? undefined : otp 
      });
    }
  } catch (err) {
    console.error('❌ Error sending OTP email:', err);
    res.status(500).json({ message: 'Failed to send OTP. ' + err.message });
  }
});

// 2. Verify OTP and Login / Register
router.post('/login', async (req, res) => {
  const { name, email, phone, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP are required' });
  }

  try {
    // Verify OTP exists and matches
    const otpRecord = await Otp.findOne({ email });
    if (!otpRecord || otpRecord.otp !== otp) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Delete verified OTP record
    await Otp.deleteOne({ email });

    // Find or create user
    let user = await User.findOne({ email });

    if (!user) {
      if (!name) {
        return res.status(400).json({ message: 'Name is required for registration' });
      }
      
      // Admin check
      const isAdminEmail = email === 'admin@vipnumbergarage.com' || email === process.env.ADMIN_EMAIL;
      
      user = new User({
        name,
        email,
        phone: phone || '',
        role: isAdminEmail ? 'admin' : 'user'
      });
      await user.save();
    } else {
      // Update phone, name or role (if email is now configured as admin)
      let updated = false;
      const isAdminEmail = email === 'admin@vipnumbergarage.com' || email === process.env.ADMIN_EMAIL;
      if (isAdminEmail && user.role !== 'admin') {
        user.role = 'admin';
        updated = true;
      }
      if (name && user.name !== name) {
        user.name = name;
        updated = true;
      }
      if (phone && user.phone !== phone) {
        user.phone = phone;
        updated = true;
      }
      if (updated) {
        await user.save();
      }
    }

    // Create JWT Token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
