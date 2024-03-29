"use client";

import { useAccount } from "wagmi";
import LandingPage from "./landingPage/LandingPage";
import Supplies from "./supplies/page";


export default function Home() {
  const { address, isDisconnected, isConnecting } = useAccount();
  if (isDisconnected || isConnecting) return <LandingPage></LandingPage>;
  return (
    <>
      <Supplies></Supplies>
    </>
  );
}
