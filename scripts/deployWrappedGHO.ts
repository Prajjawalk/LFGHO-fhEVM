import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();


  const incoProvider = new ethers.JsonRpcProvider(process.env.INCO_URL);
  const incoWallet = new ethers.Wallet(String(process.env.INCO_PRIVATE_KEY));
  const incoAccount = incoWallet.connect(incoProvider);

  const sepoliaProvider = new ethers.JsonRpcProvider(process.env.SEPOLIA_URL);
  const sepoliaWallet = new ethers.Wallet(String(process.env.SEPOLIA_PRIVATE_KEY));
  const sepoliaAccount = sepoliaWallet.connect(sepoliaProvider);

  console.log("Deploying GHO collateral contract with the account:", sepoliaAccount.address);

  const hypGHOCollateralFactory = await ethers.getContractFactory("HypGHOCollateral");
  const hypGHOCollateral = await hypGHOCollateralFactory.connect(sepoliaAccount).deploy(String(process.env.GHO_TOKEN_SEPOLIA_ADDRESS), String(process.env.SEPOLIA_MAILBOX_ADDRESS));
  await hypGHOCollateral.waitForDeployment();
  const hypGHOCollateralAddress = await hypGHOCollateral.getAddress()
  console.log("HypGHOCollateral deployed to: ", hypGHOCollateralAddress);

  console.log(`Setting ISM on Sepolia with address ${process.env.ISM_SEPOLIA_ADDRESS}`);
  await hypGHOCollateral.setInterchainSecurityModule(process.env.ISM_SEPOLIA_ADDRESS);

  console.log("Deploying wrapper GHO contract with the account:", incoAccount.address);

  const hypGHOFactory = await ethers.getContractFactory("HypGHO");
  const HypGHO = await hypGHOFactory.connect(incoAccount).deploy(18, String(process.env.INCO_MAILBOX_ADDRESS));
  await HypGHO.waitForDeployment();
  const HypGHOAddress = await HypGHO.getAddress()
  console.log("HypGHO deployed to: ", HypGHOAddress);

  console.log(`Setting ISM on Inco with address ${process.env.ISM_INCO_ADDRESS}`)
  await HypGHO.setInterchainSecurityModule(process.env.ISM_INCO_ADDRESS)

  console.log(`Enrolling remote router on Sepolia`);
  await hypGHOCollateral.enrollRemoteRouter(process.env.INCO_CHAINID, ethers.zeroPadValue(HypGHOAddress, 32))

  console.log(`Enrolling remote router on Inco`);
  await HypGHO.enrollRemoteRouter(process.env.SEPOLIA_CHAINID, ethers.zeroPadValue(hypGHOCollateralAddress, 32))

  console.log("Deploying encrypted GHO contract with the account:", incoAccount.address);

  const encryptedGHOFactory = await ethers.getContractFactory("EncryptedGHO");
  const encryptedGHO = await encryptedGHOFactory.connect(incoAccount).deploy(incoAccount.address, incoAccount.address, incoAccount.address);

  await encryptedGHO.waitForDeployment();
  const encryptedGHOAddress = await encryptedGHO.getAddress();
  console.log("EncryptedGHO deployed to: ", encryptedGHOAddress);

  console.log("Deploying USDC contract with account:", incoAccount.address);

  const usdcFactory = await ethers.getContractFactory("USDC");
  const usdc = await usdcFactory.connect(incoAccount).deploy();

  await usdc.waitForDeployment();
  const usdcAddress = await usdc.getAddress();
  console.log("USDC deployed to: ", usdcAddress);

  console.log("Deploying INCO GHO Facilitator with address ", incoAccount.address);

  const incoFacilitatorFactory = await ethers.getContractFactory("FHEVMFacilitator");
  const incoFacilitator = await incoFacilitatorFactory.connect(incoAccount).deploy(encryptedGHOAddress, usdcAddress, HypGHOAddress)

  await incoFacilitator.waitForDeployment();
  const incoFacilitatorAddress = await incoFacilitator.getAddress();
  console.log("Inco Facilitator deployed to: ", incoFacilitatorAddress);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
