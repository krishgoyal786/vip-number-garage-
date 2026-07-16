const mongoose = require('mongoose');
const Order = require('./models/Order');
require('dotenv').config();

async function run() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI is not defined in .env file.");
    process.exit(1);
  }
  
  console.log('Connecting to MongoDB...');
  await mongoose.connect(uri);
  console.log('✅ Connected to MongoDB successfully.');

  const orders = await Order.find();
  console.log(`Found ${orders.length} order(s) in the database.`);

  let updatedCount = 0;
  for (let order of orders) {
    let updated = false;
    if (!order.customer.email) {
      order.customer.email = 'customer.test@gmail.com';
      updated = true;
    }
    if (!order.customer.address) {
      order.customer.address = '123 Premium Lane, Sector 15, Bathinda, Punjab - 151001';
      updated = true;
    }
    if (updated) {
      order.markModified('customer');
      await order.save();
      console.log(`Saved order ID: ${order._id}`);
      updatedCount++;
    }
  }

  console.log(`🎉 Finished. Updated ${updatedCount} order(s) with placeholder details.`);
  await mongoose.connection.close();
}

run().catch(err => {
  console.error('❌ Error updating orders:', err);
  process.exit(1);
});
