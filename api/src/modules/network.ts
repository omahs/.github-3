import { AuthClient, StripeClient, UptimeClient } from "jewl-core";

/**
    The BetterUptime server url fetched from the env variables.
**/
const uptimeUrl = process.env.UPTIME_URL ?? "";

/**
    The BetterUptime api key fetched from the env variables.
**/
const uptimeKey = process.env.UPTIME_KEY ?? "";

/**
    A client for connecting to the BetterUptime API.
**/
export const uptimeClient = new UptimeClient(uptimeUrl, uptimeKey);

/**
    The Auth0 Management api url fetched from the env variables.
**/
const auth0Url = process.env.AUTH0_URL ?? "";

/**
    The Auth0 Management client id fetched from the env variables.
**/
const auth0Id = process.env.AUTH0_CLIENT_ID ?? "";

/**
    The Auth0 Management secret fetched from the env variables.
**/
const auth0Secret = process.env.AUTH0_CLIENT_SECRET ?? "";

/**
    A client for connecting to the Auth0 Management API.
**/
export const authClient = new AuthClient(auth0Url, auth0Id, auth0Secret);

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
