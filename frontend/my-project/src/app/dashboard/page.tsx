"use client";

import { useAccount } from "wagmi";
import Link from "next/link";
import Supplies from "../supplies/Supplies";
import { ConnectKitButton } from "connectkit";

export default function Dashboard() {
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
        <button
          type="button"
          className="inline-flex items-center px-4 py-2 text-lg font-medium text-gray-900 bg-white border border-gray-200 rounded-s-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white"
        >
                    Your Supplies ➜
        </button>

<Link href="/borrows">
        <button
          type="button"
          className="inline-flex items-center px-4 py-2 text-lg font-medium text-gray-900 bg-white border border-gray-200 rounded-e-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white"
        >
                    Your Borrows ➜
        </button></Link>
      </div>

      <Supplies></Supplies>
    </>
  );
}
