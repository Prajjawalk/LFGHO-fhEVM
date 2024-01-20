"use client"
import "./globals.css";
import Navbar from "./navbar/Navbar";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { WagmiConfig, createConfig } from "wagmi";
import { ConnectKitProvider, ConnectKitButton, getDefaultConfig } from "connectkit";

const inter = Inter({ subsets: ["latin"] });

const config = createConfig(
  getDefaultConfig({
    // Required API Keys
    alchemyId: process.env.ALCHEMY_ID, // or infuraId
    walletConnectProjectId: process.env.WALLETCONNECT_PROJECT_ID as string,

    // Required
    appName: "Your App Name",

    // Optional
    appDescription: "Your App Description",
    appUrl: "https://family.co", // your app's url
    appIcon: "https://family.co/logo.png", // your app's icon, no bigger than 1024x1024px (max. 1MB)
  }),
);


// export const metadata: Metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
       

        <WagmiConfig config={config}>
      <ConnectKitProvider>
      <Navbar></Navbar>
        {children}
      </ConnectKitProvider>
    </WagmiConfig>
      </body>
    </html>
  );
}