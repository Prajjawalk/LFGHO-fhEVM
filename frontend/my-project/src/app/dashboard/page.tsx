"use client";

import { useAccount } from "wagmi";
import Link from "next/link";
import Supplies from "../supplies/Supplies";

export default function Dashboard() {
  const { address, isDisconnected, isConnecting } = useAccount();
  if (isDisconnected || isConnecting) return <div className="mt-32 ml-3 text-4xl">Please connect your wallet to see your supplies & borrowings.</div>;
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
