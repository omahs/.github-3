import { StripeClient } from "jewl-core";

/**
    The Stripe api url fetched from the env variables.
**/
const stripeUrl = process.env.STRIPE_URL ?? "";

/**
    The Stripe api key fetched from the env variables.
**/
const stripeKey = process.env.STRIPE_KEY ?? "";

/**
    A client for connecting to the Stripe API.
**/
export const stripeClient = new StripeClient(stripeUrl, stripeKey);
