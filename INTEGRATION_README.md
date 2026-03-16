# BidiiChain ↔ Blockchain Integration

Connected the Hardhat smart contracts (ADEToken + ImpactNFT) to the BidiiChain backend.

## What's Connected

### Smart Contracts
- **ADEToken.sol** - ERC-20 reward token (1M max supply, 18 decimals)
- **ImpactNFT.sol** - ERC-721 soulbound achievement badges (4 tiers)

### Backend Integration
- `services/blockchainService.js` - Contract interaction layer using ethers.js
- `contracts/` - ABIs for both contracts
- `.env` - Contract addresses + RPC configuration

## Setup

### Step 1: Deploy Contracts

```bash
# Start local Hardhat node (in one terminal)
npx hardhat node

# In another terminal, deploy
npx hardhat run scripts/deploy.js --network localhost
```

Output will show:
```
ADE_TOKEN_ADDRESS=0x...
IMPACT_NFT_ADDRESS=0x...
```

### Step 2: Configure Backend

Copy addresses to `BidiiChain/Backend/.env`:
```env
RPC_URL=http://localhost:8545
BLOCKCHAIN_PRIVATE_KEY=0x...  # From hardhat node output
ADE_TOKEN_ADDRESS=0x...
IMPACT_NFT_ADDRESS=0x...
```

### Step 3: Run Backend

```bash
cd BidiiChain/Backend
npm install
npm run dev
```

## How It Works

### Reward Minting Flow
1. Volunteer submits proof via `POST /api/tasks/:taskId/proof`
2. Admin verifies via `POST /api/tasks/:taskId/proof/:proofId/verify`
3. Backend:
   - Marks proof as verified
   - Adds `task.reward` to user's `impactPoints` (DB)
   - **Calls `ADEToken.mint()` on blockchain** ← NEW
   - Returns response with TX hash

### Response Example
```json
{
  "message": "Proof verified and reward minted",
  "proof": { ... },
  "blockchain": {
    "success": true,
    "transactionHash": "0xabc123...",
    "blockNumber": 42,
    "amount": 50,
    "walletAddress": "0x..."
  }
}
```

## Available Services

### blockchainService.js

**mintRewardToken()**
- Mints ADE tokens to volunteer wallet
- Converts amount to wei (18 decimals)
- Returns TX hash on success

**issueBadge()** (Ready to integrate)
- Issues soulbound NFT badges
- Tiers: BRONZE, SILVER, GOLD, PLATINUM
- Cannot be transferred (soulbound)

**getUserBadges()**
- Fetches volunteer's earned badges
- Returns badge metadata

**getTokenBalance()**
- Gets ADE token balance for wallet
- Returns balance in ADE

## Architecture Diagram

```
┌─────────────────┐
│  Frontend/Postman│
└────────┬────────┘
         │
         ▼
┌─────────────────────────┐
│  BidiiChain Backend     │
│  Express + Sequelize    │
└────────┬────────────────┘
         │
    ┌────┴───────┐
    ▼            ▼
┌────────┐  ┌──────────────┐
│ MySQL  │  │ blockchainService
└────────┘  │ (ethers.js)
            └────────┬─────┘
                     │
            ┌────────┴────────┐
            ▼                 ▼
        ┌────────┐      ┌──────────┐
        │ ADEToken│      │ImpactNFT│
        │ (ERC-20)│      │ (ERC-721)│
        └────────┘      └──────────┘
                            │
                            ▼
                    ┌──────────────┐
                    │ Hardhat Node │
                    │(localhost:8545)
                    └──────────────┘
```

## Testing

### Local Testing with Postman

1. **Connect Wallet**
   ```json
   POST /api/connect-wallet
   {
     "walletAddress": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
     "name": "Alice",
     "email": "alice@test.com"
   }
   ```

2. **Create Task**
   ```json
   POST /api/tasks
   {
     "title": "Beach Cleanup",
     "description": "Clean the beach",
     "reward": 50,
     "requiredVolunteers": 5
   }
   ```

3. **Join Task**
   ```json
   POST /api/tasks/1/join
   {
     "walletAddress": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
   }
   ```

4. **Submit Proof** (file upload)
   ```
   POST /api/tasks/1/proof
   Form Data:
   - walletAddress: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
   - file: [photo.jpg]
   ```

5. **Verify Proof** (triggers blockchain mint)
   ```json
   POST /api/tasks/1/proof/1/verify
   {
     "approve": true
   }
   ```
   Response will include TX hash from blockchain!

## Environment Variables

| Variable | Purpose | Example |
|----------|---------|---------|
| `RPC_URL` | Blockchain RPC endpoint | `http://localhost:8545` |
| `BLOCKCHAIN_PRIVATE_KEY` | Private key for signing transactions | `0x...` |
| `ADE_TOKEN_ADDRESS` | Deployed token contract address | `0x...` |
| `IMPACT_NFT_ADDRESS` | Deployed NFT contract address | `0x...` |

## Networks Supported

- **localhost:8545** - Local Hardhat node (development)
- **Sepolia** - Testnet (production testing)
- **Polygon** - Layer 2 (production)
- **Mainnet** - Ethereum mainnet (production, expensive!)

## Files Changed/Created

```
/Backend/
├── package.json                    ← Added ethers.js
├── .env.example                    ← Updated blockchain configs
├── services/blockchainService.js   ← NEW - Full blockchain integration
├── contracts/
│   ├── ADEToken.json              ← NEW - Contract ABI
│   └── ImpactNFT.json             ← NEW - Contract ABI
└── controllers/
    └── proofController.js          ← Updated to return blockchain result

/scripts/
└── deploy.js                       ← NEW - Deployment helper

/BLOCKCHAIN_SETUP.md               ← NEW - Setup guide
```

## Troubleshooting

**"Contract addresses not set"**
- Run deployment script and copy addresses to .env

**"Write operations will fail"**
- Ensure BLOCKCHAIN_PRIVATE_KEY is set in .env

**"Failed to connect to RPC"**
- Is Hardhat node running? `npx hardhat node`
- Check RPC_URL matches node URL

**Transaction failed**
- Check wallet has sufficient gas
- Verify contract addresses are correct
- Check account has minting permission (owner only for ADEToken)

## Next Steps

1. ✅ Smart contracts deployed and integrated
2. ✅ Reward token minting on proof verification
3. 🔄 Badge issuance (ready, needs integration point)
4. 🔄 Frontend Web3 wallet connection
5. 🔄 Production network deployment
