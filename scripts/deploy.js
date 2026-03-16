const hre = require("hardhat");

async function main() {
  console.log("Deploying ImpactChain contracts...\n");

  // Deploy ADEToken
  console.log("1. Deploying ADEToken...");
  const ADEToken = await hre.ethers.getContractFactory("ADEToken");
  const adeToken = await ADEToken.deploy();
  await adeToken.deployed();
  console.log(`✓ ADEToken deployed to: ${adeToken.address}`);
  console.log(`  - Initial supply: 100,000 ADE`);
  console.log(`  - Max supply: 1,000,000 ADE\n`);

  // Deploy ImpactNFT
  console.log("2. Deploying ImpactNFT...");
  const ImpactNFT = await hre.ethers.getContractFactory("ImpactNFT");
  const impactNFT = await ImpactNFT.deploy();
  await impactNFT.deployed();
  console.log(`✓ ImpactNFT deployed to: ${impactNFT.address}`);
  console.log(`  - Name: ImpactChain Badge`);
  console.log(`  - Symbol: IMPACT\n`);

  // Save addresses to file
  const deploymentData = {
    network: hre.network.name,
    timestamp: new Date().toISOString(),
    contracts: {
      ADEToken: adeToken.address,
      ImpactNFT: impactNFT.address,
    },
  };

  const fs = require("fs");
  fs.writeFileSync(
    "deployment.json",
    JSON.stringify(deploymentData, null, 2)
  );

  console.log("✓ Deployment addresses saved to deployment.json\n");
  console.log("=== Deployment Summary ===");
  console.log(`Network: ${hre.network.name}`);
  console.log(`ADEToken: ${adeToken.address}`);
  console.log(`ImpactNFT: ${impactNFT.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
