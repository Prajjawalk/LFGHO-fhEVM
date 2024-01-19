// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import { IGhoToken } from "./interfaces/IGhoToken.sol";
import { EIP712WithModifier } from "fhevm/abstracts/EIP712WithModifier.sol";

contract PrivateGHO is IGhoToken, EIP712WithModifier {
    string private _name;
    string private _symbol;

    // IGhoToken functions
    function FACILITATOR_MANAGER_ROLE() external pure override returns (bytes32) {}

    function BUCKET_MANAGER_ROLE() external pure override returns (bytes32) {}

    constructor() EIP712WithModifier("Authorization token", "1") {
        _name = "PrivateGHO";
        _symbol = "pGHO";
    }

    function mint(address account, uint256 amount) external override {}

    function burn(uint256 amount) external override {}

    function addFacilitator(
        address facilitatorAddress,
        string calldata facilitatorLabel,
        uint128 bucketCapacity
    ) external override {}

    function removeFacilitator(address facilitatorAddress) external override {}

    function setFacilitatorBucketCapacity(address facilitator, uint128 newCapacity) external override {}

    function getFacilitator(address facilitator) external view override returns (Facilitator memory) {}

    function getFacilitatorBucket(address facilitator) external view override returns (uint256, uint256) {}

    function getFacilitatorsList() external view override returns (address[] memory) {}

    // IERC20 functions
    function totalSupply() external view override returns (uint256) {}

    function balanceOf(address account) external view override returns (uint256) {}

    function transfer(address recipient, uint256 amount) external override returns (bool) {}

    function allowance(address owner, address spender) external view override returns (uint256) {}

    function approve(address spender, uint256 amount) external override returns (bool) {}

    function transferFrom(address sender, address recipient, uint256 amount) external override returns (bool) {}

    // IAccessControl functions
    function hasRole(bytes32 role, address account) external view override returns (bool) {}

    function getRoleAdmin(bytes32 role) external view override returns (bytes32) {}

    function grantRole(bytes32 role, address account) external override {}

    function revokeRole(bytes32 role, address account) external override {}

    function renounceRole(bytes32 role, address account) external override {}
}
