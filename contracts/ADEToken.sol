// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ADEToken
 * @dev ADE token for ImpactChain - used for volunteer rewards
 */
contract ADEToken is ERC20, Ownable {
    // Minting cap to prevent unlimited supply
    uint256 public constant MAX_SUPPLY = 1000000 * 10 ** 18; // 1 million ADE
    
    constructor() ERC20("ADE Token", "ADE") {
        // Initial mint to owner
        _mint(msg.sender, 100000 * 10 ** 18); // 100k initial
    }

    /**
     * @dev Mint new tokens (only owner/minter)
     */
    function mint(address to, uint256 amount) public onlyOwner {
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceeds max supply");
        _mint(to, amount);
    }

    /**
     * @dev Burn tokens
     */
    function burn(uint256 amount) public {
        _burn(msg.sender, amount);
    }
}
