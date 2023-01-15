import { CoinbasePublicClient, CoinbaseClient, StripeClient } from "jewl-core";

const coinbaseKey = process.env.COINBASE_KEY ?? "";
const coinbaseSecret = process.env.COINBASE_SECRET ?? "";
const coinbasePass = process.env.COINBASE_PASS ?? "";
export const coinbasePublicClient = new CoinbasePublicClient();
export const coinbaseClient = new CoinbaseClient(coinbaseKey, coinbaseSecret, coinbasePass);

const stripeKey = process.env.STRIPE_SECRET ?? "";
export const stripeClient = new StripeClient(stripeKey);
