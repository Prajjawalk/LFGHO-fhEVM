import { ConnectKitButton } from "connectkit";
import Link from "next/link";

export default function Navbar() {
  return (
    <>
      <nav className="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <Link href="/supplies" className="flex items-center space-x-3 rtl:space-x-reverse">
            <img src="/logo.svg" className="h-8" alt="logo" />
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Crypto <span className="text-[#17B9BB]">Cafe</span> </span>
          </Link>

          <ConnectKitButton></ConnectKitButton>
        </div>
      </nav>
    </>
  );
}
