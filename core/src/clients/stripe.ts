import { StripeSessionResponse } from "../entities/stripe.js";
import { Client } from "../utility/client.js";

export class StripeClient extends Client {
    public constructor(key: string) {
        const staticHeaders = {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": `Bearer ${key}`,
            "Stripe-Version": "2022-08-01"
        };
        super("https://api.stripe.com", staticHeaders);
    }

    public async createSetupSession(callback: URL, stripeId: string): Promise<URL> {
        const data = new URLSearchParams({
            "mode": "setup",
            "payment_method_types[0]": "card",
            "payment_method_types[1]": "sepa_debit",
            "client_reference_id": stripeId,
            "success_url": callback.toString(),
            "cancel_url": callback.toString()
        });
        const request = {
            endpoint: "/v1/checkout/sessions",
            method: "POST",
            body: data.toString()
        };

        const response = await this.request(request, StripeSessionResponse);

        return response.url;
    }

    public async detatchPaymentMethod(stripeId: string): Promise<void> {
        const request = {
            endpoint: `/v1/payment_method/${stripeId}/detatch`,
            method: "POST"
        };
        await this.request(request, StripeSessionResponse);
    }
}
