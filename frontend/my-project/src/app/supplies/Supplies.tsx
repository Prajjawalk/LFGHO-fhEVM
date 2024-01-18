import Image from "next/image";
import Link from "next/link";

interface table {
  index: number;
  name: string;
  walletBalance: number;
  APY: number;
  action: string;
  action2: string;
  imgSrc: string;
}

const tableData: table[] = [
  {
    index: 1,
    name: "Bitcoin(BTC)",
    imgSrc: "/images/Table/bitcoin.svg",
    walletBalance: 16458.23,
    APY: 3.96,
    action: "Supply",
    action2: "Details",
  },
  {
    index: 2,
    name: "Ethereum(ETH)",
    imgSrc: "/images/Table/cryptoone.svg",
    walletBalance: 16458.23,
    APY: 3.96,
    action: "Supply",
    action2: "Details",
  },
  {
    index: 3,
    name: "Tether(USDT)",
    imgSrc: "/images/Table/cryptothree.svg",
    walletBalance: 16458.23,
    APY: -3.96,
    action: "Supply",
    action2: "Details",
  },
  {
    index: 4,
    name: "Binance Coin(BNB)",
    imgSrc: "/images/Table/cryptotwo.svg",
    walletBalance: 16458.23,
    APY: -3.96,
    action: "Supply",
    action2: "Details",
  },
];

export default function Supplies() {
  return (
    <>
      <div className="mx-auto max-w-7xl pt-10 px-6" id="exchange-section">
        <div className="table-b bg-navyblue p-8 overflow-x-auto">
          <h3 className="text-offwhite text-2xl">Assets to supply</h3>
          <table className="table-auto w-full mt-10">
            <thead>
              <tr className="text-white bg-darkblue rounded-lg">
                <th className="px-4 py-4 font-normal">#</th>
                <th className="px-4 py-4 text-start font-normal">ASSETS</th>
                <th className="px-4 py-4 font-normal">WALLET BALANCE</th>
                <th className="px-4 py-4 font-normal">APY</th>
                <th className="px-4 py-4 font-normal">ACTION</th>
                <th className="px-4 py-4 font-normal">INFO.</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((items, i) => (
                <tr key={i} className="border-b border-b-darkblue">
                  <td className="px-4 py-6 text-center text-white">{items.index}</td>
                  <td className="px-4 py-6 text-center text-white flex items-center justify-start gap-5 ">
                    <Image src={items.imgSrc} alt={items.imgSrc} height={50} width={50} />
                    {items.name}
                  </td>
                  <td className="px-4 py-6 text-center text-white">${items.walletBalance.toLocaleString()}</td>
                  <td className={`px-4 py-6 text-center ${items.APY < 0 ? "text-red" : "text-green"} `}>
                    {items.APY}%
                  </td>
                  <td className={`px-4 py-6 text-center ${items.action === "Supply" ? "text-green" : "text-red"}`}>
                    <button className="hover:text-blue-500">{items.action}</button>
                  </td>
                  <td className={`px-4 py-6 text-center ${items.action2 === "Details" ? "text-green" : "text-red"}`}>
                    <button className="hover:text-pink-600">{items.action2}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Image src={"/images/Table/Untitled.svg"} alt="ellipse" width={2460} height={102} className="md:mb-40 md:-mt-6" />
    </>
  );
}
