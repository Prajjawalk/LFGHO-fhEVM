"use client";
import { LiFiWidget, WidgetConfig } from '@lifi/widget';
import { useAccount } from "wagmi";
import LandingPage from '../landingPage/LandingPage';
import Navigation from '../navigation/Navigation';

const widgetConfig: WidgetConfig = {
  containerStyle: {
    border: '1px solid rgb(234, 234, 234)',
    borderRadius: '16px',
    marginTop: '3rem',
  },
  integrator: "Your dApp/company name"
};

export default function  FacilitatorSupply() {
  const { address, isDisconnected, isConnecting } = useAccount();
  if (isDisconnected || isConnecting) return <LandingPage></LandingPage>;
  return (
    <>
    <Navigation></Navigation>
    <LiFiWidget integrator="Your dApp/company name" config={widgetConfig}/>
    </>
  )
}
