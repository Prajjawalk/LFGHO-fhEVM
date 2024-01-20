"use client";

import { useAccount } from "wagmi";
import Image from "next/image";
import LandingPage from "../landingPage/LandingPage";
import Navigation from "../navigation/Navigation";


interface table {
  index: number;
  name: string;
  available: number;
  APY_variable: number;
  APY_stable: number;
  action: string;
  action2: string;
  imgSrc: string;
}

const tableData: table[] = [
  {
    index: 1,
    name: "Bitcoin(BTC)",
    imgSrc: "/images/Table/bitcoin.svg",
    available: 16458.23,
    APY_variable: 3.96,
  APY_stable: 2.55,
    action: "Borrow",
    action2: "Details",
  },
  {
    index: 2,
    name: "Ethereum(ETH)",
    imgSrc: "/images/Table/cryptoone.svg",
    available: 16458.23,
    APY_variable: 3.96,
  APY_stable: 2.55,

    action: "Borrow",
    action2: "Details",
  },
  {
    index: 3,
    name: "Tether(USDT)",
    imgSrc: "/images/Table/cryptothree.svg",
    available: 16458.23,
    APY_variable: -3.96,
  APY_stable: 2.55,

    action: "Borrow",
    action2: "Details",
  },
  {
    index: 4,
    name: "Binance Coin(BNB)",
    imgSrc: "/images/Table/cryptotwo.svg",
    available: 16458.23,
    APY_variable: -3.96,
  APY_stable: 2.55,

    action: "Borrow",
    action2: "Details",
  },
];

export default function Borrows() {
  const { address, isDisconnected, isConnecting } = useAccount();
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
                <th className="px-4 py-4 font-normal">APY_variable</th>
                <th className="px-4 py-4 font-normal">APY_stable</th>
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
                  <td className="px-4 py-6 text-center text-white">${items.available.toLocaleString()}</td>
                  <td className={`px-4 py-6 text-center ${items.APY_variable < 0 ? "text-red" : "text-green"} `}>
                    {items.APY_variable}%
                  </td>
                  <td className={`px-4 py-6 text-center ${items.APY_stable < 0 ? "text-red" : "text-green"} `}>
                    {items.APY_stable}%
                  </td>
                  <td className={`px-4 py-6 text-center ${items.action === "Supply" ? "text-green" : "text-red"}`}>
                    <button className="hover:text-blue-500">{items.action}</button>
                  </td>
                  <td className={`px-4 py-6 text-center ${items.action2 === "Details" ? "text-green" : "text-red"}`}>
                    <button className="hover:text-pink-600">{items.action2}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Image src={"/images/Table/Untitled.svg"} alt="ellipse" width={2460} height={102} className="md:mb-40 md:-mt-6" />

    </>
  );
}
