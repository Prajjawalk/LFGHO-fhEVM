"use client";

import { useAccount } from "wagmi";
import Image from "next/image";
import Navigation from "../navigation/Navigation";
import LandingPage from "../landingPage/LandingPage";
import { useState } from "react";
import Modal from "@/components/ui/modal";
import { ethers } from "ethers";
import facilitatorAbi from "../../contracts/FHEVMFacilitator.sol/FHEVMFacilitator.json"
import usdcAbi from "../../contracts/MockUSDC.sol/USDC.json"

interface table {
  index: number;
  name: string;
  walletBalance: number;
  APY: number;
  action: string;
  action2: string;
  imgSrc: string;
}

const tableData: table[] = [
  {
    index: 1,
    name: "Bitcoin(BTC)",
    imgSrc: "/images/Table/bitcoin.svg",
    walletBalance: 168.23,
    APY: 3.96,
    action: "Supply",
    action2: "Details",
  },
  {
    index: 2,
    name: "Ethereum(ETH)",
    imgSrc: "/images/Table/ethereum.svg",
    walletBalance: 1003,
    APY: 3.96,
    action: "Supply",
    action2: "Details",
  },
  {
    index: 3,
    name: "USDC",
    imgSrc: "/images/Table/usdc.svg",
    walletBalance: 54898,
    APY: 1.34,
    action: "Supply",
    action2: "Details",
  },
  {
    index: 4,
    name: "Binance Coin(BNB)",
    imgSrc: "/images/Table/bnb.svg",
    walletBalance: 50,
    APY: 0.05,
    action: "Supply",
    action2: "Details",
  },
];

export default function Supplies() {
  const { address, isDisconnected, isConnecting } = useAccount();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [supplyAssetName, setSupplyAssetName] = useState("");
  const [supplyAmount, setSupplyAmount] = useState("0")

  const openModal = (supplyAssetName: string) => {
    setSupplyAssetName(supplyAssetName);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  }

  const contractAddress = String(process.env.NEXT_PUBLIC_FACILITATOR_CONTRACT_ADDRESS);
  const usdcAddress = String(process.env.NEXT_PUBLIC_USDC_ADDRESS);
  const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
  const signer = provider.getSigner();

  const usdcContract = new ethers.Contract(
    usdcAddress,
    usdcAbi.abi,
    signer
  )

  const contract = new ethers.Contract(
    contractAddress,
    facilitatorAbi.abi,
    signer
  );

  async function supplyCollateral(amount: number) {
    if (!amount) {
      return;
    }
    try {
      const approval = await usdcContract["approve(address,uint256)"](
        contractAddress,
        BigInt(amount * (10 ** 18))
      )
      const tx = await contract["supplyUsdc(uint256)"](
        amount
      );
      console.log(`transferred new token: ${tx.hash}`);
    } catch (e) {
      console.log("e: ", e);
    }
  }

  if (isDisconnected || isConnecting) return <LandingPage></LandingPage>;
  return (
    <>
    <Navigation></Navigation>
      <div className="mx-auto max-w-7xl pt-3 px-6" id="exchange-section">
        <div className="table-b bg-navyblue p-8 overflow-x-auto">
          <h3 className="text-offwhite text-2xl">Assets to supply ➤</h3>
          <table className="table-auto w-full mt-10">
            <thead>
              <tr className="text-white bg-darkblue rounded-lg">
                <th className="px-4 py-4 font-normal">#</th>
                <th className="px-4 py-4 text-start font-normal">ASSETS</th>
                <th className="px-4 py-4 font-normal">TOTAL SUPPLIED</th>
                <th className="px-4 py-4 font-normal">APY</th>
                <th className="px-4 py-4 font-normal">ACTION</th>
                <th className="px-4 py-4 font-normal">INFO.</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((items, i) => (
                <tr key={i} className="border-b border-b-darkblue">
                  <td className="px-4 py-6 text-center text-white">{items.index}</td>
                  <td className="px-4 py-6 text-center text-white flex items-center justify-start gap-5 ">
                    <Image src={items.imgSrc} alt={items.imgSrc} height={50} width={50} />
                    {items.name}
                  </td>
                  <td className="px-4 py-6 text-center text-white">{items.walletBalance.toLocaleString()}</td>
                  <td className={`px-4 py-6 text-center ${items.APY < 0 ? "text-red" : "text-green"} `}>
                    {items.APY}%
                  </td>
                  <td className={`px-4 py-6 text-center ${items.action === "Supply" ? "text-green" : "text-red"}`}>
                    <button className="hover:text-blue-500" onClick={() => openModal(items.name)}>{items.action}</button>
                  </td>
                  <td className={`px-4 py-6 text-center ${items.action2 === "Details" ? "text-green" : "text-red"}`}>
                    <button className="hover:text-pink-600">{items.action2}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Modal isOpen={isModalOpen} onClose={closeModal}>
            {/* Content for your modal */}
            <h2 className="text-black">Supply {supplyAssetName}</h2>
            <div className="flex text-black mt-6">
                Enter the amount
                <input className="w-[189px] border-2 border-black ml-6" onChange={(e) => setSupplyAmount(e.target.value)} placeholder="0"/>
            </div>
            <div className="flex mt-6 justify-center">
              <button className="bg-black w-[130px] h-[30px] rounded-[10px]" onClick={closeModal}>Close</button>
              <button className="bg-black w-[130px] h-[30px] rounded-[10px] ml-4" onClick={() => supplyCollateral(parseInt(supplyAmount))}>Supply</button>
            </div>
          </Modal>
        </div>
      </div>
      <Image src={"/images/Table/Untitled.svg"} alt="ellipse" width={2460} height={102} className="md:mb-40 md:-mt-6" />
    </>
  );
}
