# jewl.app

*A set of smart contracts and tools for creating on-chain representations of securities and equities on the Solana Chain. By leveraging Solana's high throughput and low transaction fees, this project aims to make it easier and more efficient for companies and investors to manage and trade securities.*

## Getting Started

* Install NodeJS using `brew install node`.
* Install the Rust language using `curl -sSfL https://sh.rustup.rs | sh`.
* Install the Solana SDK using `curl -sSfL https://release.solana.com/edge/install | sh`.
* Clone this repository using `git clone https://github.com/jewl-app/.github`.
* Set up a Solana wallet if you don't have one already (see below).

### Setting up a Solana wallet

* Create a new keypair  using `solana-keygen new`.
* Check if you have a valid wallet address using `solana address`.
* Set your local config to use the Solana devnet using `solana config set --url https://api.devnet.solana.com`.
* Give yourself 1 SOL (for transaction fees) using `solana airdrop 1`.
* Check if you have a positive balance using `solana balance`.

## Components

This repository consists of the a couple of different components that can be run independently of each other. The following is a list of the components and their purpose.

### Solana Program

This part of the repository contains the [Solana](https://solana.com) program for jewl.app. This is the program account that holds all the logic related to jewl.app. This account allows users of jewl.app to exchange tokenzied securities and equities for SOL minus a small fee.

Since program accounts are stateless, they cannot hold any data. Fortunately, the jewl.app program does not need to hold any data, it only needs to know which different tokens can be issued by jewl.app. This is done by having a single state account owned by the jewl.app program that contains a list of allowed spl tokens.

#### Commands

* `npm run sol:build` - Build the jewl.app program.
* `npm run sol:start` - Start the CLI utility for the jewl.app program.
* `npm run sol:deploy` - Deploy the jewl.app program to a Solana cluster.
* `npm run sol:lint` - Lint the jewl.app program using [Clippy](https://github.com/rust-lang/rust-clippy).
* `npm run sol:test` - Run the integration tests for the jewl.app program using [solana-test-validator](https://docs.solana.com/developing/test-validator).
* `npm run sol:clean` - Clean up any built artifacts and caches.

### Web App

This part of the repository contains the [React](https://reactjs.org) static site for jewl.app. The code is bundled and opitmized using [Parcel](https://parceljs.org).

#### Commands

* `npm run web:start` - Start the web app with hot reload enabled.
* `npm run web:build` - Build the web app in production mode or for deploying.
* `npm run web:deploy` - Deploy the web app to [Firebase](https://firebase.google.com).
* `npm run web:lint` - Lint the web app using [ESLint](https://eslint.org).
* `npm run web:test` - Run the snapshot tests for the web app using [react-test-renderer](https://legacy.reactjs.org/docs/test-renderer.html).
* `npm run web:clean` - Clean up any built artifacts and caches.

*Copyright © 2023 jewl.app*
