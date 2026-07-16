const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    // Drop the deprecated phone_1 unique index if it exists in the database
    mongoose.connection.db.collection('users').dropIndex('phone_1')
      .then(() => console.log('🗑️ Successfully dropped deprecated unique index phone_1'))
      .catch((err) => {
        // Suppress error code 27 / IndexNotFound which means the index was already dropped or doesn't exist
        if (err.codeName !== 'IndexNotFound' && err.code !== 27) {
          console.warn('⚠️ Note: Could not drop phone_1 index:', err.message);
        }
      });
  })
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// Routes
const numberRoutes = require('./routes/numbers');
const queryRoutes = require('./routes/queries');
const orderRoutes = require('./routes/orders');
const authRoutes = require('./routes/auth');
const categoryRoutes = require('./routes/categories');
const requestRoutes = require('./routes/requests');
const activityRoutes = require('./routes/activities');
const paymentRoutes = require('./routes/payments');
const sellRequestRoutes = require('./routes/sellRequests');
const couponRoutes = require('./routes/coupons');
const consultationRoutes = require('./routes/consultations');

app.use('/api/numbers', numberRoutes);
app.use('/api/queries', queryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/sell-requests', sellRequestRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/consultations', consultationRoutes);

// Basic Route
app.get('/', (req, res) => {
  res.send('VipNumberGarage Backend is running...');
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
// Server initialized with real SMTP credentials & custom Admin configs (Updated App Password)
