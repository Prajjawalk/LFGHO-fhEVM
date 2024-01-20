import { ethers } from "hardhat";

import type { EncryptedGHO } from "../../types";
import { getSigners } from "../signers";

export async function deployEncryptedGHOFixture(): Promise<EncryptedGHO> {
  const signers = await getSigners();

  const contractFactory = await ethers.getContractFactory("EncryptedGHO");
  const contract = await contractFactory
    .connect(signers.alice)
    .deploy(signers.alice.address, signers.alice.address, signers.alice.address);
  await contract.waitForDeployment();

  // await contract.connect(signers.alice).grantRole(await contract.FACILITATOR_MANAGER_ROLE(), signers.alice.address);
  // await contract.connect(signers.alice).grantRole(await contract.BUCKET_MANAGER_ROLE(), signers.alice.address);

  return contract;
}
