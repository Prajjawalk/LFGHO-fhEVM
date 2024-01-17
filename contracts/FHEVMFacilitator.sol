// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import { IGhoToken } from "./interfaces/IGhoToken.sol";
import { IPrivateGho } from "./interfaces/IPrivateGho.sol";
import { TFHE } from "fhevm/lib/TFHE.sol";

contract FHEVMFacilitator {
    IGhoToken public ghoToken;
    IPrivateGho public privateGho;

    constructor(IGhoToken _ghoToken, IPrivateGho _privateGho) {
        ghoToken = _ghoToken;
        privateGho = _privateGho;
    }

    function mintEncryptedGho(address account, bytes calldata encryptedAmount) external {
        // validate that the corresponding amount of GHO has been locked on the EVM side

        // mint encrypted GHO tokens
        euint32 amount = TFHE.asEuint32(encryptedAmount);
        privateGho.mint(account, amount);
    }

    function burnEncryptedGho(address account, bytes calldata encryptedAmount) external {
        // validate that the corresponding amount of GHO has been locked on the EVM side

        // burn encrypted GHO tokens
        euint32 amount = TFHE.asEuint32(encryptedAmount);
        require(TFHE.le(amount, privateGho.encryptedBalance(account)), "Insufficient balance");
        privateGho.burn(account, amount);
    }
}
