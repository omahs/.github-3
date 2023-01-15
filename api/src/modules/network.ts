import { StripeClient, AuthClient } from "jewl-core";

const stripeKey = process.env.STRIPE_SECRET ?? "";
export const stripeClient = new StripeClient(stripeKey);

const auth0Domain = process.env.AUTH0_DOMAIN ?? "";
const auth0Id = process.env.AUTH0_CLIENT_ID ?? "";
const auth0Secret = process.env.AUTH0_CLIENT_SECRET ?? "";
export const authClient = new AuthClient(auth0Domain, auth0Id, auth0Secret);
