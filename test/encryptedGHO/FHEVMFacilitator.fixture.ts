// import { ethers } from "hardhat";

// import type { EncryptedGHO } from "../../types";
// import { getSigners } from "../signers";

// export async function deployEncryptedGHOFixture(): Promise<EncryptedGHO> {
//   const signers = await getSigners(ethers);

//   const contractFactory = await ethers.getContractFactory("EncryptedGHO");
//   const contract = await contractFactory.connect(signers.alice).deploy(signers.alice.address);
//   await contract.waitForDeployment();

//   return contract;
// }
