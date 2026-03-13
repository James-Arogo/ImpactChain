// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title ImpactNFT
 * @dev Soulbound NFT for volunteer achievements and badges
 */
contract ImpactNFT is ERC721, Ownable {
    using Counters for Counters.Counter;
    
    Counters.Counter private tokenIdCounter;
    
    // Badge tiers
    enum BadgeTier { BRONZE, SILVER, GOLD, PLATINUM }
    
    struct Badge {
        string name;
        string description;
        BadgeTier tier;
        uint256 contributionCount;
        uint256 issuedAt;
    }
    
    // Mapping of token ID to badge metadata
    mapping(uint256 => Badge) public badges;
    
    // Soulbound: prevents transfer
    mapping(uint256 => bool) public isSoulbound;
    
    event BadgeIssued(address indexed to, uint256 indexed tokenId, string badgeName);

    constructor() ERC721("ImpactChain Badge", "IMPACT") {}

    /**
     * @dev Issue a badge to a volunteer
     */
    function issueBadge(
        address to,
        string memory name,
        string memory description,
        BadgeTier tier,
        uint256 contributionCount
    ) public onlyOwner returns (uint256) {
        uint256 tokenId = tokenIdCounter.current();
        tokenIdCounter.increment();
        
        _mint(to, tokenId);
        
        badges[tokenId] = Badge({
            name: name,
            description: description,
            tier: tier,
            contributionCount: contributionCount,
            issuedAt: block.timestamp
        });
        
        isSoulbound[tokenId] = true;
        
        emit BadgeIssued(to, tokenId, name);
        return tokenId;
    }

    /**
      * @dev Prevent transfers for soulbound badges
      */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override {
        if (from != address(0) && isSoulbound[tokenId]) {
            revert("Badge is soulbound and cannot be transferred");
        }
        super._beforeTokenTransfer(from, to, tokenId);
    }

    /**
      * @dev Get badge metadata
      */
    function getBadge(uint256 tokenId) public view returns (Badge memory) {
        require(badges[tokenId].issuedAt > 0, "Badge does not exist");
        return badges[tokenId];
    }
}
