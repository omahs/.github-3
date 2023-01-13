import { StripeClient } from "jewl-core";

const stripeKey = process.env.STRIPE_SECRET ?? "";
export const stripeClient = new StripeClient(stripeKey);
