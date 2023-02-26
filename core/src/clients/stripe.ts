import type { IStripeSession } from "../entities/stripe.js";
import { StripeDelete } from "../entities/stripe.js";
import { StripeSession } from "../entities/stripe.js";
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

    /**
        Calls the stripe api to get a link to the checkout page for signing up
        for the jewl.app product. This returns the user back to `callback` after
        they either subscribed or cancelled.
    **/
    public async createSetupSession(callback: URL, userId: string, email: string): Promise<IStripeSession> {
        const data = new URLSearchParams({
            "mode": "subscription",
            "customer_email": email,
            "line_items[][price]": "price_1Mf4p4Lfa9rqgGMD6MofSLDe",
            "client_reference_id": userId,
            "success_url": callback.toString(),
            "cancel_url": callback.toString()
        });
        const request = {
            endpoint: "v1/checkout/sessions",
            method: "POST",
            body: data.toString()
        };

        return this.request(request, StripeSession);
    }

    /**
        Deletes a stripe customer which instantly cancels any open subscriptions.
        This is fine since jewl.app is billed on a useage base.
    **/
    public async deleteCustomer(customerId: string): Promise<void> {
        const request = {
            endpoint: `v1/customers/${customerId}`,
            method: "DELETE"
        };
        const response = await this.request(request, StripeDelete).ignore(404);
        if (!(response?.deleted ?? true)) { throw new Error("user not deleted"); }
    }


}
