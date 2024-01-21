"use client";

import { useAccount } from "wagmi";
import Image from "next/image";
import LandingPage from "../landingPage/LandingPage";
import Navigation from "../navigation/Navigation";
import { useState } from "react";
import Modal from "@/components/ui/modal";


interface table {
  index: number;
  name: string;
  available: number;
  APY_stable: number;
  action: string;
  action2: string;
  imgSrc: string;
}

const tableData: table[] = [
  {
    index: 1,
    name: "GHO Stable Coin",
    imgSrc: "/images/Table/gho.jpeg",
    available: 100,
  APY_stable: 1.06,
    action: "Borrow",
    action2: "Details",
  },
];

export default function Borrows() {
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
  if (isDisconnected || isConnecting) return <LandingPage></LandingPage>;
    return (
    <>

    <Navigation></Navigation>
      <div className="mx-auto max-w-7xl pt-3 px-6" id="exchange-section">
        <div className="table-b bg-navyblue p-8 overflow-x-auto">
          <h3 className="text-offwhite text-2xl">Assets to borrow ➤</h3>
          <table className="table-auto w-full mt-10">
            <thead>
              <tr className="text-white bg-darkblue rounded-lg">
                <th className="px-4 py-4 font-normal">#</th>
                <th className="px-4 py-4 text-start font-normal">ASSETS</th>
                <th className="px-4 py-4 font-normal">AVAILABLE</th>
                {/* <th className="px-4 py-4 font-normal">APY_variable</th> */}
                <th className="px-4 py-4 font-normal">INTEREST RATE</th>
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
                  <td className="px-4 py-6 text-center text-white">{items.available.toLocaleString()}</td>
                  {/* <td className={`px-4 py-6 text-center ${items.APY_variable < 0 ? "text-red" : "text-green"} `}>
                    {items.APY_variable}%
                  </td> */}
                  <td className={`px-4 py-6 text-center ${items.APY_stable < 0 ? "text-red" : "text-green"} `}>
                    {items.APY_stable}%
                  </td>
                  <td className={`px-4 py-6 text-center ${items.action === "Supply" ? "text-green" : "text-red"}`}>
                    <button className="hover:text-blue-500" onClick={() => openModal(items.name)}>{items.action} </button>
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
            <h2 className="text-black">Borrow Encrypted {supplyAssetName}</h2>
            <div className="flex text-black mt-6">
                Enter the amount
                <input className="w-[189px] border-2 border-black ml-6" onChange={(e) => setSupplyAmount(e.target.value)} placeholder="0"/>
            </div>
            <div className="flex mt-6 justify-center">
              <button className="bg-black w-[130px] h-[30px] rounded-[10px]" onClick={closeModal}>Close</button>
              <button className="bg-black w-[130px] h-[30px] rounded-[10px] ml-4" onClick={closeModal}>Borrow</button>
            </div>
          </Modal>
        </div>
      </div>
      <Image src={"/images/Table/Untitled.svg"} alt="ellipse" width={2460} height={102} className="md:mb-40 md:-mt-6" />

    </>
  );
}
