const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ImpactNFT", function () {
  let impactNFT;
  let owner, addr1, addr2;

  const BadgeTier = {
    BRONZE: 0,
    SILVER: 1,
    GOLD: 2,
    PLATINUM: 3,
  };

  beforeEach(async function () {
    const ImpactNFT = await ethers.getContractFactory("ImpactNFT");
    impactNFT = await ImpactNFT.deploy();
    await impactNFT.deployed();

    [owner, addr1, addr2] = await ethers.getSigners();
  });

  describe("Deployment", function () {
    it("Should set correct name and symbol", async function () {
      expect(await impactNFT.name()).to.equal("ImpactChain Badge");
      expect(await impactNFT.symbol()).to.equal("IMPACT");
    });

    it("Should set owner correctly", async function () {
      expect(await impactNFT.owner()).to.equal(owner.address);
    });
  });

  describe("Badge Issuance", function () {
    it("Should allow owner to issue badge", async function () {
      const tx = await impactNFT.issueBadge(
        addr1.address,
        "First Volunteer",
        "Completed first volunteer activity",
        BadgeTier.BRONZE,
        1
      );

      expect(await impactNFT.balanceOf(addr1.address)).to.equal(1);
    });

    it("Should assign correct token ID", async function () {
      await impactNFT.issueBadge(
        addr1.address,
        "First Volunteer",
        "Completed first volunteer activity",
        BadgeTier.BRONZE,
        1
      );

      expect(await impactNFT.ownerOf(0)).to.equal(addr1.address);
    });

    it("Should store badge metadata correctly", async function () {
      await impactNFT.issueBadge(
        addr1.address,
        "First Volunteer",
        "Completed first volunteer activity",
        BadgeTier.BRONZE,
        1
      );

      const badge = await impactNFT.getBadge(0);
      expect(badge.name).to.equal("First Volunteer");
      expect(badge.description).to.equal("Completed first volunteer activity");
      expect(badge.tier).to.equal(BadgeTier.BRONZE);
      expect(badge.contributionCount).to.equal(1);
    });

    it("Should set badge as soulbound", async function () {
      await impactNFT.issueBadge(
        addr1.address,
        "First Volunteer",
        "Completed first volunteer activity",
        BadgeTier.BRONZE,
        1
      );

      expect(await impactNFT.isSoulbound(0)).to.be.true;
    });

    it("Should emit BadgeIssued event", async function () {
      await expect(
        impactNFT.issueBadge(
          addr1.address,
          "First Volunteer",
          "Completed first volunteer activity",
          BadgeTier.BRONZE,
          1
        )
      ).to.emit(impactNFT, "BadgeIssued");
    });

    it("Should prevent non-owner from issuing badges", async function () {
      await expect(
        impactNFT.connect(addr1).issueBadge(
          addr1.address,
          "First Volunteer",
          "Completed first volunteer activity",
          BadgeTier.BRONZE,
          1
        )
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should issue multiple badges with incrementing token IDs", async function () {
      await impactNFT.issueBadge(
        addr1.address,
        "Badge 1",
        "First badge",
        BadgeTier.BRONZE,
        1
      );

      await impactNFT.issueBadge(
        addr2.address,
        "Badge 2",
        "Second badge",
        BadgeTier.SILVER,
        2
      );

      expect(await impactNFT.ownerOf(0)).to.equal(addr1.address);
      expect(await impactNFT.ownerOf(1)).to.equal(addr2.address);
    });
  });

  describe("Soulbound Transfer Prevention", function () {
    it("Should prevent transfer of soulbound badge", async function () {
      await impactNFT.issueBadge(
        addr1.address,
        "First Volunteer",
        "Completed first volunteer activity",
        BadgeTier.BRONZE,
        1
      );

      await expect(
        impactNFT.connect(addr1).transferFrom(addr1.address, addr2.address, 0)
      ).to.be.revertedWith("Badge is soulbound and cannot be transferred");
    });

    it("Should prevent safeTransferFrom of soulbound badge", async function () {
      await impactNFT.issueBadge(
        addr1.address,
        "First Volunteer",
        "Completed first volunteer activity",
        BadgeTier.BRONZE,
        1
      );

      await expect(
        impactNFT.connect(addr1).safeTransferFrom(addr1.address, addr2.address, 0)
      ).to.be.revertedWith("Badge is soulbound and cannot be transferred");
    });

    it("Should allow minting (from address 0)", async function () {
      // This is tested indirectly through issueBadge
      await expect(
        impactNFT.issueBadge(
          addr1.address,
          "First Volunteer",
          "Completed first volunteer activity",
          BadgeTier.BRONZE,
          1
        )
      ).to.not.be.reverted;
    });
  });

  describe("Get Badge Metadata", function () {
    it("Should return badge metadata for valid token", async function () {
      const timestamp = (await ethers.provider.getBlock("latest")).timestamp;
      
      await impactNFT.issueBadge(
        addr1.address,
        "Platinum Achievement",
        "Reached platinum tier",
        BadgeTier.PLATINUM,
        10
      );

      const badge = await impactNFT.getBadge(0);
      expect(badge.name).to.equal("Platinum Achievement");
      expect(badge.description).to.equal("Reached platinum tier");
      expect(badge.tier).to.equal(BadgeTier.PLATINUM);
      expect(badge.contributionCount).to.equal(10);
      expect(badge.issuedAt).to.be.greaterThanOrEqual(timestamp);
    });

    it("Should revert for non-existent badge", async function () {
      await expect(
        impactNFT.getBadge(999)
      ).to.be.revertedWith("Badge does not exist");
    });
  });

  describe("Badge Tiers", function () {
    it("Should support all badge tiers", async function () {
      const tiers = [
        { tier: BadgeTier.BRONZE, name: "Bronze Badge" },
        { tier: BadgeTier.SILVER, name: "Silver Badge" },
        { tier: BadgeTier.GOLD, name: "Gold Badge" },
        { tier: BadgeTier.PLATINUM, name: "Platinum Badge" },
      ];

      for (let i = 0; i < tiers.length; i++) {
        await impactNFT.issueBadge(
          addr1.address,
          tiers[i].name,
          `Description for ${tiers[i].name}`,
          tiers[i].tier,
          i + 1
        );

        const badge = await impactNFT.getBadge(i);
        expect(badge.tier).to.equal(tiers[i].tier);
      }
    });
  });
});
