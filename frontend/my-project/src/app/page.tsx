"use client";

import Dashboard from "./dashboard/Dashboard";
import { Button } from "@/components/ui/button";
import { useAccount } from "wagmi";

export default function Home() {
  const { address, isDisconnected, isConnecting } = useAccount();
  if (isDisconnected || isConnecting) return <div>Disconnected</div>;
  return (
    <>
      <Dashboard></Dashboard>
    </>
  );
}
