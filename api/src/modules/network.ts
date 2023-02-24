import { AuthClient, StripeClient, UptimeClient } from "jewl-core";

const uptimeUrl = process.env.UPTIME_URL ?? "";
const uptimeKey = process.env.UPTIME_KEY ?? "";
export const uptimeClient = new UptimeClient(uptimeUrl, uptimeKey);

const auth0Url = process.env.AUTH0_URL ?? "";
const auth0Id = process.env.AUTH0_CLIENT_ID ?? "";
const auth0Secret = process.env.AUTH0_CLIENT_SECRET ?? "";
export const authClient = new AuthClient(auth0Url, auth0Id, auth0Secret);

const stripeUrl = process.env.STRIPE_URL ?? "";
const stripeKey = process.env.STRIPE_KEY ?? "";
export const stripeClient = new StripeClient(stripeUrl, stripeKey);
