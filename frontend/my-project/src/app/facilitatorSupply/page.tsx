"use client";

import { useAccount } from "wagmi";
import LandingPage from '../landingPage/LandingPage';

export default function  FacilitatorSupply() {
  const { address, isDisconnected, isConnecting } = useAccount();
  if (isDisconnected || isConnecting) return <LandingPage></LandingPage>;
  return (
    <div className="mt-96">Facilitator Supply</div>
  )
}
