const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ADEToken", function () {
  let adeToken;
  let owner, addr1, addr2;

  beforeEach(async function () {
    const ADEToken = await ethers.getContractFactory("ADEToken");
    adeToken = await ADEToken.deploy();
    await adeToken.deployed();

    [owner, addr1, addr2] = await ethers.getSigners();
  });

  describe("Deployment", function () {
    it("Should set correct name and symbol", async function () {
      expect(await adeToken.name()).to.equal("ADE Token");
      expect(await adeToken.symbol()).to.equal("ADE");
    });

    it("Should mint 100k tokens to owner on deployment", async function () {
      const ownerBalance = await adeToken.balanceOf(owner.address);
      expect(ownerBalance).to.equal(ethers.utils.parseEther("100000"));
    });

    it("Should set correct max supply", async function () {
      const maxSupply = await adeToken.MAX_SUPPLY();
      expect(maxSupply).to.equal(ethers.utils.parseEther("1000000"));
    });

    it("Should set owner correctly", async function () {
      expect(await adeToken.owner()).to.equal(owner.address);
    });
  });

  describe("Minting", function () {
    it("Should allow owner to mint tokens", async function () {
      const amount = ethers.utils.parseEther("50000");
      await adeToken.mint(addr1.address, amount);
      const balance = await adeToken.balanceOf(addr1.address);
      expect(balance).to.equal(amount);
    });

    it("Should prevent minting over max supply", async function () {
      const amount = ethers.utils.parseEther("950001");
      await expect(
        adeToken.mint(addr1.address, amount)
      ).to.be.revertedWith("Exceeds max supply");
    });

    it("Should prevent non-owner from minting", async function () {
      const amount = ethers.utils.parseEther("1000");
      await expect(
        adeToken.connect(addr1).mint(addr1.address, amount)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should update total supply after mint", async function () {
      const amount = ethers.utils.parseEther("100000");
      await adeToken.mint(addr1.address, amount);
      const total = await adeToken.totalSupply();
      expect(total).to.equal(ethers.utils.parseEther("200000"));
    });
  });

  describe("Burning", function () {
    it("Should allow user to burn their tokens", async function () {
      const burnAmount = ethers.utils.parseEther("10000");
      const initialBalance = await adeToken.balanceOf(owner.address);
      
      await adeToken.burn(burnAmount);
      
      const finalBalance = await adeToken.balanceOf(owner.address);
      expect(finalBalance).to.equal(initialBalance.sub(burnAmount));
    });

    it("Should reduce total supply when burning", async function () {
      const burnAmount = ethers.utils.parseEther("10000");
      const initialSupply = await adeToken.totalSupply();
      
      await adeToken.burn(burnAmount);
      
      const finalSupply = await adeToken.totalSupply();
      expect(finalSupply).to.equal(initialSupply.sub(burnAmount));
    });

    it("Should prevent burning more than balance", async function () {
      const amount = ethers.utils.parseEther("1000000000");
      await expect(
        adeToken.burn(amount)
      ).to.be.revertedWith("ERC20: burn amount exceeds balance");
    });
  });

  describe("Transfer", function () {
    it("Should allow token transfers", async function () {
      const amount = ethers.utils.parseEther("1000");
      await adeToken.transfer(addr1.address, amount);
      expect(await adeToken.balanceOf(addr1.address)).to.equal(amount);
    });

    it("Should emit Transfer event", async function () {
      const amount = ethers.utils.parseEther("1000");
      await expect(
        adeToken.transfer(addr1.address, amount)
      ).to.emit(adeToken, "Transfer");
    });
  });
});
