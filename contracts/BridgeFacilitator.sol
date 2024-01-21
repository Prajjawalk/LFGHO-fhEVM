// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { AccessControl } from "@openzeppelin/contracts/access/AccessControl.sol";
import { IHypGHOCollateral } from "../interfaces/IHypGHOCollateral.sol";

/**
 * @title BridgeFacilitator
 * @dev Facilitates the locking and unlocking of GHO tokens as collateral on EVM and
 *      triggers corresponding mint/burn actions for wrapped GHO on fhEVM via cross chain messaging.
 */
contract BridgeFacilitator is AccessControl {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    uint256 public totalLockedGho;
    mapping(address user => uint256 amountLocked) private userLockedGho;

    IERC20 public ghoToken;
    IHypGHOCollateral public router;

    event GhoLocked(address indexed user, uint256 amount);
    event GhoUnlocked(address indexed user, uint256 amount);

    /**
     * @notice Constuctor
     * @param _ghoToken The address of the GHO token contract
     * @param _router The address of the HypGHO collateral router
     */
    constructor(address _ghoToken, address _router) {
        grantRole(ADMIN_ROLE, msg.sender);
        ghoToken = IERC20(_ghoToken);
        router = IHypGHOCollateral(_router);
    }

    /**
     * @dev Locks a specified amount of GHO tokens and mints equivalent wrapped GHO on the fhEVM.
     * @param amount The amount of GHO tokens to lock.
     * @param _destinationChain The target chain for the wrapped GHO tokens.
     * @param _recipient The address to receive the wrapped GHO tokens on the target chain.
     */
    function lockGho(uint256 amount, uint32 _destinationChain, address _recipient) external {
        require(amount > 0, "No GHO sent");
        require(
            router.transferRemote(_destinationChain, bytes32(uint256(uint160(_recipient))), amount) != "",
            "Transfer failed"
        );
        totalLockedGho += amount;
        userLockedGho[msg.sender] += amount;
        emit GhoLocked(msg.sender, amount);
    }

    /**
     * @dev Returns the total amount of GHO locked by a specific user.
     * @param user The address of the user.
     * @return The total amount of GHO locked by the user.
     */
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
