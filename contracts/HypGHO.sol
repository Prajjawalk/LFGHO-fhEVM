// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.0;

import { TokenRouter } from "@hyperlane-xyz/core/contracts/token/libs/TokenRouter.sol";
import { Errors } from "@aave/core-v3/contracts/protocol/libraries/helpers/Errors.sol";

import { ERC20Upgradeable } from "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";

/**
 * @title Hyperlane GHO Token Router that extends GHO with remote transfer functionality.
 * @dev Supply on each chain is not constant but the aggregate supply across all chains is.
 */
contract HypGHO is ERC20Upgradeable, TokenRouter {
    uint8 private immutable _decimals;

    constructor(uint8 __decimals, address _mailbox) TokenRouter(_mailbox) {
        _decimals = __decimals;
    }

    /**
     * @notice Initializes the Hyperlane router, ERC20 metadata, and mints initial supply to deployer.
     * @param _totalSupply The initial supply of the token.
     * @param _name The name of the token.
     * @param _symbol The symbol of the token.
     */
    function initialize(uint256 _totalSupply, string memory _name, string memory _symbol) external initializer {
        // Initialize ERC20 metadata
        __ERC20_init(_name, _symbol);
        _mint(msg.sender, _totalSupply);
    }

    function decimals() public view override returns (uint8) {
        return _decimals;
    }

    function balanceOf(address _account) public view virtual override(TokenRouter, ERC20Upgradeable) returns (uint256) {
        return ERC20Upgradeable.balanceOf(_account);
    }

    /**
     * @dev Burns `_amount` of token from `msg.sender` balance.
     * @inheritdoc TokenRouter
     */
    function _transferFromSender(uint256 _amount) internal override returns (bytes memory) {
        _burn(msg.sender, _amount);
        return bytes(""); // no metadata
    }

    /**
     * @dev Mints `_amount` of token to `_recipient` balance.
     * @inheritdoc TokenRouter
     */
    function _transferTo(
        address _recipient,
        uint256 _amount,
        bytes calldata // no metadata
    ) internal virtual override {
        _mint(_recipient, _amount);
    }

    /**
     * @dev Being non transferrable, the wrapped GHO facilitator token does not implement any of the
     * standard ERC20 functions for transfer and allowance.
     */
    function transfer(address, uint256) public virtual override returns (bool) {
        revert(Errors.OPERATION_NOT_SUPPORTED);
    }

    function allowance(address, address) public view virtual override returns (uint256) {
        revert(Errors.OPERATION_NOT_SUPPORTED);
    }

    function approve(address, uint256) public virtual override returns (bool) {
        revert(Errors.OPERATION_NOT_SUPPORTED);
    }

    function transferFrom(address, address, uint256) public virtual override returns (bool) {
        revert(Errors.OPERATION_NOT_SUPPORTED);
    }

    function increaseAllowance(address, uint256) public virtual override returns (bool) {
        revert(Errors.OPERATION_NOT_SUPPORTED);
    }

    function decreaseAllowance(address, uint256) public virtual override returns (bool) {
        revert(Errors.OPERATION_NOT_SUPPORTED);
    }
}
