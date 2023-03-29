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

This part of the repository contains the [Solana](https://solana.com) program for jewl.app. There are various accounts that play a part in jewl.app's program. The following is a list of the accounts and their purpose.

This is the program account that holds all the logic related to jewl.app. This account allows users of jewl.app to exchange tokenzied securities and equities for SOL minus a small fee.

Since program accounts are stateless, they cannot hold any data. Fortunately, the jewl.app program does not need to hold any data, it only needs to know which different tokens can be issued by jewl.app. This is done by the existance of SPL token mint accounts of which the jewl program account is the Owner.

The jewl program account also needs to know which SPL token accounts hold the reserves of the tokens that can be exchanged for SOL. This is done by the existance of SPL token accounts of which the jewl program account is the Owner.

You can build the program using the `npm run sol:build` command. There is also a CLI to interract with the program. You can start the CLI using the `npm run sol:start` command.

### Web App

This part of the repository contains the [React](https://reactjs.org) static site for jewl.app. The web app can be started using the `npm run web:start` command. A production version can be built using the `npm run web:build` command.

### Miscellaneous

There are a couple other commands related to running checks and tests. The following is a list of the commands and their purpose.

* `npm run test` - run the unit test suite which tests web using [react-test-renderer](https://legacy.reactjs.org/docs/test-renderer.html) and the Solana program using a [solana-test-validator](https://docs.solana.com/developing/test-validator).
* `npm run lint` - run the [ESLint](https://eslint.org) linter and prettier. You can automatically fix any linting errors by appending `-- --fix` to the command.
* `npm run clean` - cleanup any built artifacts and caches. This is useful if you are having issues with the build.


*Copyright © 2023 jewl.app*
