# jewl.app

*A set of smart contracts and tools for creating on-chain representations of securities and equities on the Solana Chain. By leveraging Solana's high throughput and low transaction fees, this project aims to make it easier and more efficient for companies and investors to manage and trade securities.*

This repository consists of the a couple of different components that can be run independently of each other. The following is a list of the components and their purpose.

## Solana Smart Contract

This part of the repository contains the [Solana](https://solana.com) smart contract for jewl.app. There are various accounts that play a part in jewl.app's smart contract. The following is a list of the accounts and their purpose.

* **jewl program**: This is the program account that holds all the logic related to jewl.app. This account allows users of jewl.app to exchange tokenzied securities and equities for SOL minus a small fee.
* **jewl state**: The jewl account owns a single data account which stores the addresses of all the tokens that are supported by jewl.app.
* **token mints**: The jewl account owns an SPL token mint account for each token that is supported by jewl.app. These token mints are used to mint tokens that are being exchanged for SOL.
* **token accounts**: The jewl account owns an SPL token account for each token that is supported by jewl.app. These token accounts are used to hold the tokens reserves that can be exchanged for SOL.

### Getting Started

* Install the Solana SDK using `curl -sSfL https://release.solana.com/stable/install | sh`
* Clone this repository using `git clone https://github.com/jewl-app/.github`.
* Set up a Solana wallet if you don't have one already (see below).
* Build the project using `make`.
* Deploy the project to solana using `solana program deploy dist/jewl.so`.

### Setting up a Solana wallet

* Create a new keypair  using `solana-keygen new`.
* Check if you have a valid wallet address using `solana address`.
* Set your local config to use the Solana devnet using `solana config set --url https://api.devnet.solana.com`.
* Give yourself 1 SOL (for transaction fees) using `solana airdrop 1`.
* Check if you have a positive balance using `solana balance`.

## Command Line Interface

This repository contains a CLI for convenience. The CLI can be used deploy the programs and to interact with the deployed programs.

### Getting Started

* Install NodeJS using `brew install node`.
* Clone this repository using `git clone https://github.com/jewl-app/.github`.
* Install dependencies using npm using `npm install`.
* Run one of the commands below like `npm run jewl`.

## Web App

This part of the repository contains the [React](https://reactjs.org) static site for jewl.app.

### Getting Started

* Install NodeJS using `brew install node`.
* Clone this repository using `git clone https://github.com/jewl-app/.github`.
* Install dependencies using npm using `npm install`.
* Run one of the commands below like `npm run start`.

### Commands

Below is a (non-exhaustive) list of available commands:
* `npm run start` - start up the web app in development mode.
* `npm run build` - compile the web app for deployment or serving.
* `npm run clean` - clean up all local build products.
* `npm run test` - runs the [Jest](https://jestjs.io) unit tests.
* `npm run lint` - runs [ESLint](https://eslint.org) to check for bugs and code conventions.

*Copyright © 2023 jewl.app*
