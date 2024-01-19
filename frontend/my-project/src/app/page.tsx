"use client";

import Dashboard from "./dashboard/page";
import { useAccount } from "wagmi";
import { ConnectKitButton } from "connectkit";


export default function Home() {
  const { address, isDisconnected, isConnecting } = useAccount();
  // if (isDisconnected || isConnecting) return <div className="mt-32 ml-3 text-4xl">Please connect your wallet to see your supplies & borrowings.</div>;
  if (isDisconnected || isConnecting) return <div className="flex justify-evenly justify-items-center content-center flex-wrap-reverse h-screen">
  <div className="w-1/3 h-96 self-center">
    <div className="w-[800px] h-[165px]"><span className="text-blue-50 text-[58px] font-normal font-['GalanoGrotesque-Bold'] leading-[66.41px]">Discover & Unlock <br/>Your</span><span className="text-zinc-700 text-[58px] font-normal font-['GalanoGrotesque-Bold'] leading-[66.41px]"> </span><span className="text-teal-400 text-[58px] font-normal font-['GalanoGrotesque-Bold'] leading-[66.41px]">Financial World   </span></div>
    <div className="w-[600px] h-16 text-blue-50 text-[24px] font-medium font-['Archivo'] leading-[38.06px]">Connect your wallet and gain instant access to your supplies, borrowings, and open positions.</div>
    <div className="mt-20"><ConnectKitButton></ConnectKitButton></div>
  </div>
  <img src="/images/Table/hero_image.png" alt="hero-img" className="-z-10"/>
  </div>;
  return (
    <>
      <Dashboard></Dashboard>
    </>
  );
}
