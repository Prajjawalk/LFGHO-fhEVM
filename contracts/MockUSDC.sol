// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// This is a mock USDC contract used as a sample collateral in the FHEVMfacilitator contract
contract USDC is ERC20 {
    constructor() ERC20("USD Coin", "USDC") {
        _mint(msg.sender, 1000000 * (10 ** uint256(decimals())));
    }
}
