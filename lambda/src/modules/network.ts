import { CoinbasePublicClient, CoinbaseClient, StripeClient, AuthClient } from "jewl-core";

const coinbaseUrl = process.env.COINBASE_URL ?? "";
const coinbaseKey = process.env.COINBASE_KEY ?? "";
const coinbaseSecret = process.env.COINBASE_SECRET ?? "";
const coinbasePass = process.env.COINBASE_PASS ?? "";
export const coinbasePublicClient = new CoinbasePublicClient();
export const coinbaseClient = new CoinbaseClient(coinbaseUrl, coinbaseKey, coinbaseSecret, coinbasePass);

const stripeUrl = process.env.STRIPE_URL ?? "";
const stripeKey = process.env.STRIPE_SECRET ?? "";
export const stripeClient = new StripeClient(stripeUrl, stripeKey);

const auth0Url = process.env.AUTH0_URL ?? "";
const auth0Id = process.env.AUTH0_CLIENT_ID ?? "";
const auth0Secret = process.env.AUTH0_CLIENT_SECRET ?? "";
export const authClient = new AuthClient(auth0Url, auth0Id, auth0Secret);