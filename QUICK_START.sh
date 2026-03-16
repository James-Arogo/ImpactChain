#!/bin/bash

# BidiiChain ↔ Blockchain Integration Quick Start
# This script helps setup and run the integrated system

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
BLOCKCHAIN_DIR="$SCRIPT_DIR"
BACKEND_DIR="$SCRIPT_DIR/BidiiChain/Backend"

echo "🚀 BidiiChain Blockchain Integration Quick Start"
echo "=================================================="

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install Node.js first."
    exit 1
fi

# Parse command
COMMAND=${1:-help}

case $COMMAND in
    install)
        echo "📦 Installing dependencies..."
        echo ""
        echo "1. Installing Hardhat dependencies..."
        cd "$BLOCKCHAIN_DIR"
        npm install
        
        echo ""
        echo "2. Installing Backend dependencies..."
        cd "$BACKEND_DIR"
        npm install
        
        echo ""
        echo "✅ Dependencies installed!"
        echo ""
        echo "Next: Run 'bash QUICK_START.sh deploy' to deploy contracts"
        ;;
        
    deploy)
        echo "🔗 Deploying smart contracts..."
        echo ""
        echo "⚠️  Make sure 'npx hardhat node' is running in another terminal!"
        echo ""
        
        cd "$BLOCKCHAIN_DIR"
        echo "Deploying to localhost..."
        npx hardhat run scripts/deploy.js --network localhost
        
        echo ""
        echo "✅ Deployment complete!"
        echo ""
        echo "📋 Copy the contract addresses above and paste into:"
        echo "   $BACKEND_DIR/.env"
        echo ""
        echo "Next: Run 'bash QUICK_START.sh env' to setup .env"
        ;;
        
    env)
        echo "⚙️  Setting up .env file..."
        
        if [ ! -f "$BACKEND_DIR/.env" ]; then
            echo "Creating .env from .env.example..."
            cp "$BACKEND_DIR/.env.example" "$BACKEND_DIR/.env"
            echo "✅ Created .env file"
            echo ""
            echo "📝 Edit the following in $BACKEND_DIR/.env:"
            echo "   - DB_PASSWORD"
            echo "   - BLOCKCHAIN_PRIVATE_KEY"
            echo "   - ADE_TOKEN_ADDRESS"
            echo "   - IMPACT_NFT_ADDRESS"
        else
            echo "⚠️  .env already exists at $BACKEND_DIR/.env"
        fi
        ;;
        
    backend)
        echo "🔥 Starting BidiiChain Backend..."
        echo ""
        
        if [ ! -f "$BACKEND_DIR/.env" ]; then
            echo "❌ .env file not found!"
            echo "   Run: bash QUICK_START.sh env"
            exit 1
        fi
        
        if [ ! -d "$BACKEND_DIR/node_modules" ]; then
            echo "📦 Installing dependencies first..."
            cd "$BACKEND_DIR"
            npm install
        fi
        
        cd "$BACKEND_DIR"
        echo "Starting server on http://localhost:4000"
        echo ""
        npm run dev
        ;;
        
    node)
        echo "🔗 Starting Hardhat local node..."
        echo ""
        cd "$BLOCKCHAIN_DIR"
        npx hardhat node
        ;;
        
    compile)
        echo "🔨 Compiling smart contracts..."
        cd "$BLOCKCHAIN_DIR"
        npx hardhat compile
        echo "✅ Compilation complete!"
        ;;
        
    test)
        echo "🧪 Running smart contract tests..."
        cd "$BLOCKCHAIN_DIR"
        npx hardhat test
        ;;
        
    *)
        echo "Usage: bash QUICK_START.sh [command]"
        echo ""
        echo "Commands:"
        echo "  install   - Install all dependencies"
        echo "  deploy    - Deploy contracts to local Hardhat node"
        echo "  env       - Setup .env configuration"
        echo "  backend   - Start BidiiChain backend"
        echo "  node      - Start Hardhat local node"
        echo "  compile   - Compile contracts"
        echo "  test      - Run contract tests"
        echo ""
        echo "Quick setup flow:"
        echo "  1. bash QUICK_START.sh install"
        echo "  2. bash QUICK_START.sh node          (in terminal 1)"
        echo "  3. bash QUICK_START.sh deploy        (in terminal 2)"
        echo "  4. bash QUICK_START.sh env"
        echo "  5. bash QUICK_START.sh backend       (in terminal 2)"
        echo ""
        echo "Then test with Postman using the collection:"
        echo "  BidiiChain/ImpactChain.postman_collection.json"
        ;;
esac
