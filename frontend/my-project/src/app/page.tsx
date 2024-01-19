"use client";

import Dashboard from "./dashboard/page";
import { useAccount } from "wagmi";

export default function Home() {
  const { address, isDisconnected, isConnecting } = useAccount();
  if (isDisconnected || isConnecting) return <div className="mt-32 ml-3 text-4xl">Please connect your wallet to see your supplies & borrowings.</div>;
  return (
    <>
      <Dashboard></Dashboard>
    </>
  );
}
