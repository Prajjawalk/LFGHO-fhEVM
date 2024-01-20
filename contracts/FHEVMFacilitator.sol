// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import { IGhoToken } from "./interfaces/IGhoToken.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { Math } from "@openzeppelin/contracts/utils/math/Math.sol";
import "fhevm/abstracts/EIP712WithModifier.sol";
import "fhevm/lib/TFHE.sol";

// this contract will receive the gho from bridge
// total mintable cap will be set to the amount of gho received from the bridge

contract FHEVMFacilitator is EIP712WithModifier {
    IGhoToken public privateGho;
    IERC20 public usdcToken; // mock USDC
    IERC20 public hypGhoToken; // wrapped GHO
    // euint32 internal totalMintableCap; // matches the amount of gho bridged
    euint32 internal currentMinted;

    mapping(address user => euint32 collateral) public collateralSupplied;
    mapping(address user => euint32 borrowed) public ghoBorrowed;

    constructor(
        IGhoToken _privateGho,
        IERC20 _usdcToken,
        IERC20 _hypGHOToken
    ) EIP712WithModifier("FHEVMFacilitator", "1") {
        privateGho = _privateGho;
        usdcToken = _usdcToken;
        hypGhoToken = _hypGHOToken;
    }

    // TODO: function to receive hypGHO

    function supplyUsdc(uint256 amount) external {
        require(usdcToken.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        euint32 encryptedAmount = TFHE.asEuint32(amount);
        collateralSupplied[msg.sender] = TFHE.add(collateralSupplied[msg.sender], encryptedAmount);
    }

    function withdrawUsdc(uint256 amount) external {
        euint32 supplied = collateralSupplied[msg.sender];
        euint32 encryptedAmount = TFHE.asEuint32(amount);
        ebool isLessThanEqualTo = TFHE.le(encryptedAmount, supplied);
        require(TFHE.decrypt(isLessThanEqualTo), "Insufficient collateral");
        collateralSupplied[msg.sender] = TFHE.sub(supplied, encryptedAmount);
        // we are transfering with inital plaintext input
        usdcToken.transfer(msg.sender, amount);
    }

    // if the execution order of optimistic require causes issues with mint then lets convert to another pattern
    // https://docs.inco.network/getting-started/solidity-+-tfhe/control-structures
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

    function burnEncryptedGho(address account, bytes calldata encryptedAmount) external {
        euint32 amount = TFHE.asEuint32(encryptedAmount);
        ebool sufficientBalance = TFHE.le(amount, privateGho.encryptedBalance(account));
        TFHE.optReq(sufficientBalance);
        privateGho.burn(account, encryptedAmount);
        ghoBorrowed[account] = TFHE.sub(ghoBorrowed[account], amount);
        currentMinted = TFHE.sub(currentMinted, amount);
    }

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
