// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import { IGhoToken } from "./interfaces/IGhoToken.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { Math } from "@openzeppelin/contracts/utils/math/Math.sol";
import "fhevm/abstracts/EIP712WithModifier.sol";
import "fhevm/lib/TFHE.sol";

/**
 * @title FHEVMFacilitator
 * @dev This contract will receive wrapped gho from evm bridge and allow the minting of Private GHO on fhEVM after sufficient collateral is supplied
 */
contract FHEVMFacilitator is EIP712WithModifier {
    IGhoToken public privateGho;
    IERC20 public usdcToken; // mock USDC
    IERC20 public hypGhoToken; // wrapped bridged GHO
    euint32 internal currentMinted;

    mapping(address user => euint32 collateral) public collateralSupplied;
    mapping(address user => euint32 borrowed) public ghoBorrowed;

    /**
     * @dev Initializes the contract by setting the privateGho, usdcToken, and hypGhoToken.
     * @param _privateGho The address of the Private GHO token
     * @param _usdcToken The address of the USDC collateral token
     * @param _hypGHOToken The address of the bridged GHO token
     */
    constructor(
        IGhoToken _privateGho,
        IERC20 _usdcToken,
        IERC20 _hypGHOToken
    ) EIP712WithModifier("Authorization token", "1") {
        privateGho = _privateGho;
        usdcToken = _usdcToken;
        hypGhoToken = _hypGHOToken;
    }

    /**
     * @dev Allows a user to supply USDC as collateral.
     * @param amount The amount of USDC to supply.
     *
     * Requirements:
     * - The caller must have enough USDC balance.
     */
    function supplyUsdc(uint256 amount) external {
        require(usdcToken.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        euint32 encryptedAmount = TFHE.asEuint32(amount);
        collateralSupplied[msg.sender] = TFHE.add(collateralSupplied[msg.sender], encryptedAmount);
    }

    /**
     * @dev Allows a user to withdraw USDC from their collateral.
     * @param amount The amount of USDC to withdraw.
     *
     * Requirements:
     * - The caller must have enough collateral.
     */
    function withdrawUsdc(uint256 amount) external {
        euint32 supplied = collateralSupplied[msg.sender];
        euint32 encryptedAmount = TFHE.asEuint32(amount);
        ebool isLessThanEqualTo = TFHE.le(encryptedAmount, supplied);
        require(TFHE.decrypt(isLessThanEqualTo), "Insufficient collateral");
        collateralSupplied[msg.sender] = TFHE.sub(supplied, encryptedAmount);
        // we are transfering with inital plaintext input
        usdcToken.transfer(msg.sender, amount);
    }

    /**
     * @dev Mints encrypted GHO tokens to a specified account.
     * @param account The address of the account to mint the tokens to.
     * @param encryptedAmount The amount of tokens to mint, encrypted.
     *
     * Requirements:
     * - The caller must have enough collateral.
     * - The minted amount must be within the mintable cap.
     */
    function mintEncryptedGho(address account, bytes calldata encryptedAmount) external {
        euint32 amount = TFHE.asEuint32(encryptedAmount);
        ebool hasEnoughCollateral = TFHE.le(TFHE.add(ghoBorrowed[account], amount), collateralSupplied[account]);
        currentMinted = TFHE.add(currentMinted, amount);
        ebool withinMintableCap = TFHE.le(currentMinted, TFHE.asEuint32(hypGhoToken.totalSupply()));
        privateGho.mint(account, encryptedAmount);
        ghoBorrowed[account] = TFHE.add(ghoBorrowed[account], amount);
        TFHE.optReq(hasEnoughCollateral);
        TFHE.optReq(withinMintableCap);
    }

    /**
     * @dev Burns encrypted GHO tokens from a specified account.
     * @param account The address of the account to burn the tokens from.
     * @param encryptedAmount The amount of tokens to burn, encrypted.
     *
     * Requirements:
     * - The caller must have a sufficient balance.
     */
    function burnEncryptedGho(address account, bytes calldata encryptedAmount) external {
        euint32 amount = TFHE.asEuint32(encryptedAmount);
        ebool sufficientBalance = TFHE.le(amount, privateGho.encryptedBalance(account));
        TFHE.optReq(sufficientBalance);
        privateGho.burn(account, encryptedAmount);
        ghoBorrowed[account] = TFHE.sub(ghoBorrowed[account], amount);
        currentMinted = TFHE.sub(currentMinted, amount);
    }

    /**
     * @dev Returns the max mintable GHO tokens for an account.
     * @param account The address of the account.
     * @param publicKey The public key of the account.
     * @param signature The signature of the account.
     * @return The re-encrypted max mintable amount.
     */
    function getMaxMintableAmount(
        address account,
        bytes32 publicKey,
        bytes calldata signature
    ) public view onlySignedPublicKey(publicKey, signature) returns (bytes memory) {
        euint32 currentBorrowed = ghoBorrowed[account];
        euint32 currentCollateral = collateralSupplied[account];
        euint32 remainingCollateralCapacity = TFHE.sub(currentCollateral, currentBorrowed);

        euint32 maxMintable = TFHE.min(
            remainingCollateralCapacity,
            TFHE.sub(TFHE.asEuint32(hypGhoToken.totalSupply()), currentMinted)
        );
        return TFHE.reencrypt(maxMintable, publicKey);
    }
}
