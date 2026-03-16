# 🎯 BidiiChain ↔ Blockchain Integration

**Status**: ✅ **COMPLETE AND READY TO USE**

This integration connects the Hardhat smart contracts (ADEToken + ImpactNFT) to the BidiiChain backend, enabling:
- **Automatic token rewards** when proofs are verified
- **Achievement badges** as NFTs (soulbound)
- **On-chain verification** of community impact

---

## 🚀 Quick Start (5 minutes)

### Prerequisites
- Node.js 16+
- npm
- MySQL running locally
- Postman (for testing)

### Setup Commands

```bash
# 1. Install dependencies
bash QUICK_START.sh install

# 2. Start Hardhat node (Terminal 1)
bash QUICK_START.sh node

# 3. Deploy contracts (Terminal 2)
bash QUICK_START.sh deploy

# 4. Configure backend
bash QUICK_START.sh env
# Edit BidiiChain/Backend/.env with values from step 3

# 5. Start backend (Terminal 2)
bash QUICK_START.sh backend
```

That's it! Backend runs on `http://localhost:4000`

---

## 📋 What Was Integrated

### Smart Contracts
```solidity
ADEToken.sol     →  ERC-20 token for volunteer rewards
ImpactNFT.sol    →  ERC-721 soulbound achievement badges
```

### Backend Files

| File | Purpose |
|------|---------|
| `services/blockchainService.js` | Ethers.js contract interactions |
| `contracts/ADEToken.json` | Token contract ABI |
| `contracts/ImpactNFT.json` | NFT contract ABI |
| `package.json` | Added ethers dependency |
| `controllers/proofController.js` | Updated to trigger blockchain calls |
| `scripts/deploy.js` | Automated contract deployment |

---

## 🔄 Integration Flow

### Proof Verification → Token Minting

```
┌─────────────────────────────────────┐
│  Admin verifies proof                │
│  POST /api/tasks/1/proof/1/verify   │
└──────────────────┬──────────────────┘
                   │
                   ▼
       ┌─────────────────────────┐
       │  Backend Processing     │
       ├─────────────────────────┤
       │ 1. Mark proof verified  │
       │ 2. Add reward points    │
       │ 3. Call blockchain      │
       └─────────────┬───────────┘
                     │
                     ▼
      ┌──────────────────────────────┐
      │  blockchainService.js        │
      │  (ethers.js)                 │
      └──────────────┬───────────────┘
                     │
                     ▼
      ┌──────────────────────────────┐
      │  Smart Contract              │
      │  ADEToken.mint()             │
      │  (on-chain transaction)      │
      └──────────────┬───────────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │  Response to Client   │
         │  {                    │
         │    proof: {...},      │
         │    blockchain: {      │
         │      transactionHash, │
         │      blockNumber      │
         │    }                  │
         │  }                    │
         └───────────────────────┘
```

---

## 🧪 Testing with Postman

Use the included Postman collection: `ImpactChain.postman_collection.json`

### Test Sequence

1. **Connect Wallet**
   ```
   POST /api/connect-wallet
   Body: {
     "walletAddress": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
     "name": "Alice",
     "email": "alice@test.com"
   }
   ```

2. **Get Dashboard**
   ```
   GET /api/dashboard/0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
   ```

3. **Create Task**
   ```
   POST /api/tasks
   Body: {
     "title": "Beach Cleanup",
     "description": "Clean the beach",
     "reward": 50,
     "requiredVolunteers": 5
   }
   ```

4. **Join Task**
   ```
   POST /api/tasks/1/join
   Body: {
     "walletAddress": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
   }
   ```

5. **Submit Proof**
   ```
   POST /api/tasks/1/proof
   Form Data:
   - walletAddress: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
   - file: [upload a photo]
   ```

6. **Verify Proof** ← **⛓️ TRIGGERS BLOCKCHAIN MINT**
   ```
   POST /api/tasks/1/proof/1/verify
   Body: {
     "approve": true
   }
   
   Response will include:
   {
     "message": "Proof verified and reward minted",
     "proof": {...},
     "blockchain": {
       "success": true,
       "transactionHash": "0x...",
       "blockNumber": 42,
       "amount": 50
     }
   }
   ```

---

## ⚙️ Configuration

### Environment Variables (`.env`)

```env
# Database
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=impactchain_dev

# Blockchain
RPC_URL=http://localhost:8545
BLOCKCHAIN_PRIVATE_KEY=0x...
ADE_TOKEN_ADDRESS=0x...
IMPACT_NFT_ADDRESS=0x...
```

### Getting Values

- **RPC_URL**: Hardhat node URL (localhost:8545)
- **BLOCKCHAIN_PRIVATE_KEY**: From `hardhat node` output (first account)
- **ADE_TOKEN_ADDRESS & IMPACT_NFT_ADDRESS**: From `hardhat run scripts/deploy.js` output

---

## 📦 Service API Reference

### blockchainService.js

#### `mintRewardToken()`
Mints ADE tokens to a volunteer's wallet
```javascript
const result = await blockchainService.mintRewardToken({
  walletAddress: '0x...',
  taskId: 1,
  proofId: 1,
  amount: 50
});
// Returns: { success: true, transactionHash: '0x...', ... }
```

#### `issueBadge()` (Ready to integrate)
Issues an achievement NFT badge
```javascript
const result = await blockchainService.issueBadge({
  walletAddress: '0x...',
  badgeName: 'Bronze Volunteer',
  description: 'Completed first task',
  tier: 0,  // 0=BRONZE, 1=SILVER, 2=GOLD, 3=PLATINUM
  contributionCount: 1
});
```

#### `getUserBadges()`
Fetches user's earned badges
```javascript
const badges = await blockchainService.getUserBadges('0x...');
// Returns: [{ name, tier, issuedAt, ... }]
```

#### `getTokenBalance()`
Gets ADE token balance
```javascript
const balance = await blockchainService.getTokenBalance('0x...');
// Returns: '150.5' (as string in ADE)
```

---

## 🌐 Network Support

| Network | RPC URL | Status | Use Case |
|---------|---------|--------|----------|
| **Localhost** | http://localhost:8545 | ✅ Ready | Development |
| **Sepolia** | https://sepolia.infura.io/v3/KEY | ✅ Ready | Testing |
| **Polygon** | https://polygon-rpc.com | ✅ Ready | Production (cheap) |
| **Ethereum** | https://eth.infura.io/v3/KEY | ✅ Ready | Production (expensive) |

To switch networks, just update `RPC_URL` in `.env`

---

## 🛠️ Troubleshooting

### "Contract addresses not set"
- Run deployment: `bash QUICK_START.sh deploy`
- Copy addresses to `.env`

### "Failed to connect to RPC"
- Is Hardhat node running? `bash QUICK_START.sh node`
- Check RPC_URL in `.env`

### "Write operations will fail"
- Set BLOCKCHAIN_PRIVATE_KEY in `.env`
- Copy from `hardhat node` startup output

### "Transaction out of gas"
- Increase gas limit in blockchainService.js
- Or reduce amount per transaction

### Backend won't start
- Check MySQL is running
- Run migrations: `npx sequelize db:migrate`
- Check all DB credentials in `.env`

---

## 📚 Documentation Files

- **INTEGRATION_SUMMARY.md** - This integration (what was done)
- **BLOCKCHAIN_SETUP.md** - Detailed setup guide
- **INTEGRATION_README.md** - Full technical details
- **BidiiChain/Backend/README.md** - Backend API docs
- **contracts/ADEToken.sol** - Token contract
- **contracts/ImpactNFT.sol** - NFT contract

---

## 🎯 Next Steps (Optional)

1. **Create Badge Endpoint**
   ```javascript
   // Add to proofController or new endpoint
   POST /api/tasks/:taskId/badge
   // Issue badge when reward reaches threshold
   ```

2. **Token Balance Endpoint**
   ```javascript
   GET /api/user/:walletAddress/balance
   // Returns ADE balance from blockchain
   ```

3. **Frontend Web3 Integration**
   ```javascript
   // In React component
   const adeToken = new ethers.Contract(
     ADE_TOKEN_ADDRESS,
     ADETokenABI,
     provider
   );
   const balance = await adeToken.balanceOf(userWallet);
   ```

4. **Event Listening**
   ```javascript
   // Listen to Transfer events from smart contract
   adeToken.on('Transfer', (from, to, amount) => {
     console.log('Token transferred!', { from, to, amount });
   });
   ```

5. **Production Deployment**
   - Deploy contracts to Sepolia testnet first
   - Test thoroughly
   - Deploy to mainnet (Polygon recommended for lower costs)

---

## 📊 Architecture Overview

```
Frontend (React/Next.js + OKX Web3)
         ↓
API Server (Express.js)
    ├─ /api/tasks (CRUD operations)
    ├─ /api/tasks/:id/join (Join task)
    ├─ /api/tasks/:id/proof (Submit proof)
    └─ /api/tasks/:id/proof/:id/verify ← triggers blockchain
         ↓
Database (MySQL)
    └─ Stores: Users, Tasks, Proofs, Volunteers

Blockchain Layer (ethers.js)
    ├─ blockchainService.js (abstraction)
    ├─ ADEToken (ERC-20)
    └─ ImpactNFT (ERC-721)
         ↓
Smart Contracts (Solidity)
    └─ Deployed on Ethereum-compatible chain
```

---

## ✨ Key Features

✅ **Automatic Reward Minting** - Tokens minted on proof verification  
✅ **Soulbound Badges** - Achievement NFTs that cannot be traded  
✅ **Multi-Network Support** - Works on localhost, testnets, and mainnets  
✅ **Error Handling** - Graceful fallback if blockchain is unavailable  
✅ **Easy Integration** - Minimal changes to existing backend  
✅ **Testable** - Full Postman collection included  
✅ **Production Ready** - Uses industry-standard tools (ethers.js, Hardhat)

---

## 🚀 Deployment Checklist

- [ ] Run `npm install` in both directories
- [ ] Start Hardhat node: `npx hardhat node`
- [ ] Deploy contracts: `npx hardhat run scripts/deploy.js --network localhost`
- [ ] Copy contract addresses to `.env`
- [ ] Copy private key to `.env`
- [ ] Create MySQL database: `CREATE DATABASE impactchain_dev;`
- [ ] Run migrations: `npx sequelize db:migrate`
- [ ] Start backend: `npm run dev`
- [ ] Test with Postman collection
- [ ] Verify blockchain response in Postman

---

## 💡 Need Help?

1. Check **TROUBLESHOOTING.md** in BidiiChain/Backend
2. Review **BLOCKCHAIN_SETUP.md** for detailed instructions
3. Check contract ABIs in `contracts/` folder
4. Review blockchainService.js for function signatures

---

**🎉 Ready to go! Happy building!**
