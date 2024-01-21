# PrivateGHO | GHO shh

🤫

## Overview
The PrivateGHO token enhances the GHO stablecoin with a privacy preserving layer of encryption. The token offers users the ability to hold the token with private balances and transfer hidden amounts.


## Stack
- Solidity: Smart contracts
- Hyperlane: Cross chain bridge from evm to fhEVM
- fhEVM: Fully Homomorphic Ethereum Virtual Machine for PrivateGHO transactions
- TFHE Solidity Library: Enabling encryption within smart contracts
- Next.js: User interface
- ConnectKit: Wallet login and network interaction


## Usage

### fhEVM Contracts

#### Pre Requisites

Install [docker](https://docs.docker.com/engine/install/)

Install [pnpm](https://pnpm.io/installation)

Before being able to run any command, you need to create a `.env` file and set a BIP-39 compatible mnemonic as an
environment variable. You can follow the example in `.env.example`. If you don't already have a mnemonic, you can use
this [website](https://iancoleman.io/bip39/) to generate one.

Then, proceed with installing dependencies:

```sh
pnpm install
```

#### Start fhevm

Start a local fhevm docker container that inlcudes everything needed to deploy FHE encrypted smart contracts

```sh
# In one terminal, keep it opened
# The node logs are printed
pnpm fhevm:start
```

To stop:

```sh
pnpm fhevm:stop
```

#### Compile

Compile the smart contracts with Hardhat:

```sh
pnpm compile
```

#### TypeChain

Compile the smart contracts and generate TypeChain bindings:

```sh
pnpm typechain
```

#### List accounts

From the mnemonic in .env file, list all the derived Ethereum adresses:

```sh
pnpm task:accounts
```

#### Get some native coins

In order to interact with the blockchain, one need some coins. This command will give coins to the first address derived
from the mnemonic in .env file.

```sh
pnpm fhevm:faucet
```

<br />
<details>
  <summary>To get the first derived address from mnemonic</summary>
<br />

```sh
pnpm task:getEthereumAddress
```

</details>
<br />

#### Deploy

Deploy PrivateGHO contracts

```sh
pnpm deploy:contracts
```

### Frontend

Enter frontend folder and install dependencies

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## License

This project is licensed under MIT.
