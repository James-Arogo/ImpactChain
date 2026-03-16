# Wallet Connection Setup Guide

## Prerequisites

1. **MetaMask Extension** - Install from [metamask.io](https://metamask.io)
2. **Hardhat Node Running** - Terminal 1:
   ```bash
   cd /home/james-arogo/Desktop/Blockchain
   npx hardhat node
   ```

3. **Contracts Deployed** - Terminal 2:
   ```bash
   cd /home/james-arogo/Desktop/Blockchain
   npx hardhat run scripts/deploy.js --network hardhat
   ```
   Save the contract addresses from output.

4. **Backend Running** - Terminal 3:
   ```bash
   cd /home/james-arogo/Desktop/Blockchain/BidiiChain/Backend
   npm run dev
   ```

5. **Frontend Running** - Terminal 4:
   ```bash
   cd /home/james-arogo/Desktop/Blockchain/BidiiChain/Frontend
   npm run dev
   ```

---

## Setup MetaMask for Localhost

1. Open MetaMask extension
2. Click network dropdown (top left)
3. Click **"Add Network"** or **"Custom RPC"**
4. Fill in these details:
   - **Network Name**: `Hardhat Localhost`
   - **RPC URL**: `http://127.0.0.1:8545`
   - **Chain ID**: `1337`
   - **Currency Symbol**: `ETH`
   - Click **"Save"**

---

## Get Test ETH (Hardhat Accounts)

MetaMask won't have funds. Import one of Hardhat's default accounts:

1. Copy this private key from Hardhat output:
   ```
   0xac0974bec39a17e36ba4a6b4d238ff944bacb476cadccdddfb5d4c3d348e4175
   ```

2. In MetaMask:
   - Click account menu (top right)
   - **"Import Account"**
   - Paste the private key
   - Click **"Import"**

3. You'll get 1000 ETH (test balance) ✅

---

## Connect to Frontend

1. Go to [http://localhost:5173](http://localhost:5173)
2. Click **"Connect Wallet"** button (top right)
3. MetaMask popup appears
4. Select the account with test ETH
5. Click **"Connect"**
6. Network automatically switches to Hardhat Localhost
7. Your address appears in navbar (e.g., `0x1234...5678`)

---

## Submit a Contribution

1. Connected ✅
2. Go to **"Submit"** page
3. Select a task
4. Upload photo/video proof
5. Click **"Claim Soulbound Badge & Token Reward"**
6. AI verification runs
7. Badge NFT + 100 ADE tokens minted to your wallet

---

## Verify on Blockchain

After submission:

1. Check contract state:
   ```bash
   npx hardhat console --network hardhat
   > const token = await ethers.getContractAt("ADEToken", "0x...")
   > await token.balanceOf("0xYourAddress")
   ```

2. Or use Remix IDE:
   - Go to [remix.ethereum.org](https://remix.ethereum.org)
   - Load your contract ABIs
   - Connect to Hardhat Localhost
   - Call `balanceOf()` with your wallet address

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| MetaMask not showing | Install from [metamask.io](https://metamask.io) |
| Can't connect to localhost | Ensure `npx hardhat node` is running on terminal 1 |
| Wallet won't connect | Clear MetaMask cache: Settings → Advanced → Clear data |
| No test ETH | Import Hardhat's default private key (see above) |
| Contracts not found | Re-run deployment script and update contract addresses |

---

## Complete Flow

```
Terminal 1: npx hardhat node          ← Blockchain
    ↓
Terminal 2: npm run dev (Backend)      ← API
    ↓
Terminal 3: npm run dev (Frontend)     ← UI
    ↓
Browser: http://localhost:5173         ← User Interface
    ↓
Click "Connect Wallet" → MetaMask popup
    ↓
Select account with test ETH
    ↓
Connected! Upload proof → Mint Badge + Token
```

Done! 🎉
