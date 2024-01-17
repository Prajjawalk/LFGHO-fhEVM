// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { AccessControl } from "@openzeppelin/contracts/access/AccessControl.sol";
import { IHypGHOCollateral } from "../interfaces/IHypGHOCollateral.sol";

// facilitates the locking and unlocking of collateral on EVM
// triggers corresponding mint/burn actions for wrapped GHO on fhEVM via cross chain messaging

contract BridgeFacilitator is AccessControl {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    uint256 public totalLockedGho;
    mapping(address user => uint256 amountLocked) private userLockedGho;

    IERC20 public ghoToken;
    IHypGHOCollateral public router;

    event GhoLocked(address indexed user, uint256 amount);
    event GhoUnlocked(address indexed user, uint256 amount);

    constructor(address _ghoToken, address _router) {
        grantRole(ADMIN_ROLE, msg.sender);
        ghoToken = IERC20(_ghoToken);
        router = IHypGHOCollateral(_router);
    }

    function lockGho(uint256 amount, uint32 _destinationChain, address _recipient) external {
        require(amount > 0, "No GHO sent");

        // lock GHO and mint wrapped GHO on fhEVM
        require(router.transferRemote(_destinationChain, bytes32(uint256(uint160(_recipient))), amount), "Transfer failed");
        totalLockedGho += amount;
        userLockedGho[msg.sender] += amount;
        emit GhoLocked(msg.sender, amount);
    }

    // Unlock will take place on fhEVM side
    // function unlockGho(uint256 amount) external {
    //     require(amount > 0, "No GHO sent");
    //     require(userLockedGho[msg.sender] >= amount, "Insufficient collateral");
    //     totalLockedGho -= amount;
    //     userLockedGho[msg.sender] -= amount;
    //     require(ghoToken.transfer(msg.sender, amount), "Transfer failed");
    //     emit GhoUnlocked(msg.sender, amount);

    //     // burn wrapped GHO on fhEVM
    // }

    function getUserLockedGho(address user) external view returns (uint256) {
        return userLockedGho[user];
    }

    function grantAdminRole(address account) external onlyRole(ADMIN_ROLE) {
        grantRole(ADMIN_ROLE, account);
    }

    function revokeAdminRole(address account) external onlyRole(ADMIN_ROLE) {
        revokeRole(ADMIN_ROLE, account);
    }

    receive() external payable {
        revert("Direct ETH sends are not allowed");
    }
}
