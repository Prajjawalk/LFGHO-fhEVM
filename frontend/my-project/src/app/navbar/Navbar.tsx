import { ConnectKitButton } from "connectkit";
import Link from "next/link";

export default function Navbar() {
  return (
    <>
      

<nav className="border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
  <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
    <Link href="#" className="flex items-center space-x-3 rtl:space-x-reverse">
        <img src="" className="h-8" alt="" />
        <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Crypto Cafe</span>
    </Link>

    <ConnectKitButton></ConnectKitButton>
    
  </div>
</nav>

    </>
  );
}
