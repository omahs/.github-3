import { Client } from "../utility/client.js";

/**
    A client for talking to the Stripe api.
**/
export class StripeClient extends Client {
    public constructor(url: string, key: string) {
        const staticHeaders = {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": `Bearer ${key}`,
            "Stripe-Version": "2022-11-15"
        };
        super(url, staticHeaders);
    }
}
