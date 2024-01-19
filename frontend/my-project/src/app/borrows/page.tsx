"use client";

import { useAccount } from "wagmi";
import Image from "next/image";
import Link from "next/link";
import { ConnectKitButton } from "connectkit";


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
  if (isDisconnected || isConnecting) return <div className="flex justify-evenly justify-items-center content-center flex-wrap-reverse h-screen">
  <div className="w-1/3 h-96 self-center">
    <div className="w-[800px] h-[165px]"><span className="text-blue-50 text-[58px] font-normal font-['GalanoGrotesque-Bold'] leading-[66.41px]">Discover & Unlock <br/>Your</span><span className="text-zinc-700 text-[58px] font-normal font-['GalanoGrotesque-Bold'] leading-[66.41px]"> </span><span className="text-teal-400 text-[58px] font-normal font-['GalanoGrotesque-Bold'] leading-[66.41px]">Financial World   </span></div>
    <div className="w-[600px] h-16 text-blue-50 text-[22px] font-medium font-['Archivo'] leading-[38.06px]">Connect your wallet and gain instant access to your supplies, borrowings, and open positions.</div>
    <div className="mt-20"><ConnectKitButton></ConnectKitButton></div>
  </div>
  <img src="/images/Table/hero_image.png" alt="hero-img" className="-z-10"/>
  </div>;
    return (
    <>

    <div className="inline-flex lg:ml-80 ml-5 mt-28 rounded-md shadow-sm" role="group">
    <Link href="/dashboard">

        <button
          type="button"
          className="inline-flex items-center px-4 py-2 text-lg font-medium text-gray-900 bg-white border border-gray-200 rounded-s-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white"
        >
                              Your Supplies ➜
        </button></Link>

        <button
          type="button"
          className="inline-flex items-center px-4 py-2 text-lg font-medium text-gray-900 bg-white border border-gray-200 rounded-e-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white"
        >
                              Your Borrows ➜

        </button>
      </div>
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
