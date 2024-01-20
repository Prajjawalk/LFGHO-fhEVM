import { expect } from "chai";
import { ethers } from "hardhat";

import { createInstances } from "../instance";
import { getSigners } from "../signers";
import { deployEncryptedGHOFixture } from "./EncryptedGHO.fixture";

describe("EncryptedGHO", function () {
  before(async function () {
    this.signers = await getSigners();
  });

  beforeEach(async function () {
    const contract = await deployEncryptedGHOFixture();
    this.contractAddress = await contract.getAddress();
    this.gho = contract;
    this.instances = await createInstances(this.contractAddress, ethers, this.signers);
  });

  it("should mint the contract", async function () {
    await this.gho
      .connect(this.signers.alice)
      .addFacilitator(this.signers.alice.address, "mint facilitator", this.instances.alice.encrypt32(1000000000));
    const encryptedAmount = this.instances.alice.encrypt32(1000);
    const transaction = await this.gho.mint(this.signers.alice.address, encryptedAmount);
    await transaction.wait();

    // Call the method

    const token = this.instances.alice.getPublicKey(this.contractAddress) || {
      signature: "",
      publicKey: "",
    };

    // Sign token
    const encryptedBalance = await this.gho.balanceOf(token.publicKey, token.signature);
    // Decrypt the balance
    const balance = this.instances.alice.decrypt(this.contractAddress, encryptedBalance);
    expect(balance).to.equal(1000);

    const encryptedTotalSupply = await this.gho.getTotalSupply(token.publicKey, token.signature);
    // Decrypt the total supply
    const totalSupply = this.instances.alice.decrypt(this.contractAddress, encryptedTotalSupply);
    expect(totalSupply).to.equal(1000);
  });
});
