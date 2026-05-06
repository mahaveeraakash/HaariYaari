#!/bin/bash
# Deployment script for HaariYaari on AWS EC2 t3.micro
# Run this from /home/ec2-user/HaariYaari

echo "========================================="
echo "1. Memory Management: Stopping processes"
echo "========================================="
pm2 stop all 2>/dev/null || true
pkill -f node 2>/dev/null || true

echo "========================================="
echo "2. Memory Management: Checking Swap Space"
echo "========================================="
# Create 2GB swap if it doesn't exist
if [ ! -f /swapfile ]; then
    echo "Creating 2GB swap file to prevent OOM..."
    sudo fallocate -l 2G /swapfile
    sudo chmod 600 /swapfile
    sudo mkswap /swapfile
    sudo swapon /swapfile
    # Persist the swap file across reboots
    echo "/swapfile swap swap defaults 0 0" | sudo tee -a /etc/fstab
else
    echo "Swap file already exists. Moving on."
fi

echo "========================================="
echo "3. Clean Build"
echo "========================================="
npm install
npm run build

echo "========================================="
echo "4. Service Restart: Backend & Frontend"
echo "========================================="
# Start Backend
pm2 start server.js --name "haariyaari-backend"

# Serve Frontend via static server 'serve'
if ! command -v serve &> /dev/null; then
    echo "Installing 'serve' globally..."
    sudo npm install -g serve
fi
pm2 start "serve -s dist -l 3000" --name "haariyaari-frontend"

# Save PM2 state
pm2 save

echo "========================================="
echo "5. Verify Deployment"
echo "========================================="
echo "Testing Backend API Products endpoint:"
curl -s http://3.82.106.13:5000/api/products | head -c 200
echo -e "\n\nDeployment complete! Your app should be accessible at http://3.82.106.13:3000"
