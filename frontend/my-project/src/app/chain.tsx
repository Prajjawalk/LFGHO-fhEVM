import { defineChain } from 'viem'

export const inco = defineChain({
  id: 9090,
  name: 'Inco',
  nativeCurrency: { name: 'Inco', symbol: 'INCO', decimals: 18 },
  rpcUrls: {
    public: { http: ['https://evm-rpc.inco.network'] },
    default: { http: ['https://evm-rpc.inco.network'] },
  },
  blockExplorers: {
    default: { name: 'Blockscout', url: 'https://explorer.inco.network' },
  },
  network: "testnet"
})
