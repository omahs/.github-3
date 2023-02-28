# jewl.app
[![Frontend](https://img.shields.io/website?down_color=red&down_message=down&label=frontend&logo=react&logoColor=white&up_color=green&up_message=up&url=https%3A%2F%2Fjewl.app)](https://jewl.app/)
[![Backend](https://img.shields.io/website?down_color=red&down_message=down&label=backend&logo=express&logoColor=white&up_color=green&up_message=up&url=https%3A%2F%2Fjewl.app%2Fapi)](https://jewl.app/api/)

## The app

This repository consists of several components:
* `isomorphic` - platform-specific code.
* `core` - shared logic and models.
* `web` - a [React](https://reactjs.org) static site.
* `api` - an [Express](https://expressjs.com) backend application interface.
* `lambda` - a [Node](https://nodejs.org) worker program.

All components are tied together using [Nx](https://nx.dev). jewl.app uses a [Mongo](https://www.mongodb.com) NoSQL database.

## Third Party tools

This repository uses a couple of third party services:
* The deployments are hosted on [DigitalOcean](https://digitalocean.com).
* Authentication and authorization are managed by [Auth0](https://auth0.com).
* Secure financial payments are managed through [Stripe](https://stripe.com).
* Logging and monitoring is done through [BetterStack](https://betterstack.com).
* Domain management and registrar services are handled by [Namecheap](https://namecheap.com)

## Getting Started

Getting set up with this repository is very easy.
* Install node and MongoDB using `brew install node mongodb-community`.
* Start MongoDB server using `brew services start mongodb-community`.
* Clone this repository using `git clone https://github.com/jewl-app/.github`.
* Create the `.env` files for each component that you want to run.
* Install dependencies using npm using `npm install`.
* Run one of the commands below like `npm run start`.

### Testing Stripe webhooks locally

To test the Stripe webhooks locally you can set webhooks up to be forwarded to your local machine. For this you will need to set up the Stripe cli.
* Install the Stripe cli using `brew install stripe/stripe-cli/stripe`.
* Log into the Stripe cli using `stripe login`
* Start forwarding webhook evewnts using `stripe listen --forward-to localhost:4000/v1/stripe`.

## Commands

All commands should be run from the root of the repository. Some commands will be resolved for each components individually (local) whereas others will just execute once (global). The local commands commands will try to run a command with the same name for each individual component, skipping the component if that specific command does not exist.

Below is a (non-exhaustive) list of available commands:
* `npm run start` - start up one (or more) of the components (local).
* `npm run watch` - start up one (or more) of the components and watch for changes in the source files (local).
* `npm run build` - compile the TypeScript code for deployment or serving (local).
* `npm run clean` - clean up all local build products (global).
* `npm run test` - runs the [Jest](https://jestjs.io) unit tests (global).
* `npm run lint` - runs [ESLint](https://eslint.org) to check for bugs and code conventions (global).

If you look closely, the local commands just call individual commands specified in the component's `package.json` file. These commands should not be run by themselves as it will not resolve the right dependencies and will not execute the prerequisites. Instead you can specify which app to run with `-- jewl-web`, `-- jewl-api` or `-- jewl-lambda`.

*Copyright © 2023 jewl.app*
