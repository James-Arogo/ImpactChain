#!/bin/bash

# ImpactChain Local Startup Script
# Starts: Hardhat Blockchain + Backend API + Frontend UI

set -e

echo "🚀 Starting ImpactChain (localhost setup)..."
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if in correct directory
if [ ! -d "BidiiChain" ]; then
    echo "❌ Please run this script from the Blockchain root directory"
    exit 1
fi

echo "${YELLOW}Step 1: Starting Hardhat Blockchain...${NC}"
echo "💾 Running on localhost:8545"
cd /home/james-arogo/Desktop/Blockchain
npx hardhat node &
HARDHAT_PID=$!
sleep 3

echo ""
echo "${YELLOW}Step 2: Deploying Contracts...${NC}"
sleep 2
DEPLOY_OUTPUT=$(npx hardhat run scripts/deploy.js --network hardhat 2>&1)
echo "$DEPLOY_OUTPUT"

# Extract contract addresses (optional - for info)
ADE_ADDRESS=$(echo "$DEPLOY_OUTPUT" | grep "ADEToken:" | tail -1 | awk '{print $NF}')
NFT_ADDRESS=$(echo "$DEPLOY_OUTPUT" | grep "ImpactNFT:" | tail -1 | awk '{print $NF}')

echo ""
echo "${GREEN}✓ Contracts Deployed:${NC}"
echo "  ADE Token:  $ADE_ADDRESS"
echo "  Impact NFT: $NFT_ADDRESS"

echo ""
echo "${YELLOW}Step 3: Starting Backend API...${NC}"
echo "🖥️  Running on localhost:4000"
cd /home/james-arogo/Desktop/Blockchain/BidiiChain/Backend
npm run dev &
BACKEND_PID=$!
sleep 2

echo ""
echo "${YELLOW}Step 4: Starting Frontend UI...${NC}"
echo "🎨 Running on localhost:5173"
cd /home/james-arogo/Desktop/Blockchain/BidiiChain/Frontend
npm run dev &
FRONTEND_PID=$!

sleep 3

echo ""
echo "${GREEN}========================================${NC}"
echo "${GREEN}✅ ImpactChain Running!${NC}"
echo "${GREEN}========================================${NC}"
echo ""
echo "🔗 Services:"
echo "   Blockchain:  http://localhost:8545"
echo "   Backend API: http://localhost:4000"
echo "   Frontend UI: http://localhost:5173"
echo ""
echo "📋 Next Steps:"
echo "   1. Open http://localhost:5173 in your browser"
echo "   2. Install MetaMask (if not already installed)"
echo "   3. Import account with private key from Hardhat"
echo "   4. Click 'Connect Wallet' in navbar"
echo "   5. Go to /submit and upload proof"
echo ""
echo "⏹️  To stop all services: press Ctrl+C"
echo ""

# Wait for all processes
wait
