#!/bin/bash

# Exit on any error
set -e

echo "=========================================="
echo "🚀 VIP Number Garage Auto-Deploy Script"
echo "=========================================="

# 1. Pull latest changes from GitHub
echo "📥 1. Pulling latest code from GitHub..."
git pull origin main

# 2. Build Frontend
echo "📦 2. Installing frontend dependencies & building..."
npm install
npm run build

# 3. Update & Restart Backend
echo "⚙️ 3. Installing server dependencies..."
cd server
npm install

echo "🔄 4. Restarting API server with PM2..."
# Detect PM2 application name or restart by ID
if pm2 list | grep -q "server"; then
  pm2 restart server
  echo "✅ Restarted PM2 process: 'server'"
elif pm2 list | grep -q "vip-backend"; then
  pm2 restart vip-backend
  echo "✅ Restarted PM2 process: 'vip-backend'"
else
  # Fallback to restart first PM2 process (ID 0)
  pm2 restart 0
  echo "✅ Restarted default PM2 process (ID 0)"
fi

echo "=========================================="
echo "🎉 DEPLOYMENT COMPLETED SUCCESSFULLY!"
echo "=========================================="
