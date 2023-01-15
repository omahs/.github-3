import type { IStripeRefund, IStripeSession } from "../entities/stripe.js";
import { StripeRefund, StripeSession, StripePaymentMethod } from "../entities/stripe.js";
import { Client } from "../utility/client.js";
import type { PreciseNumber } from "../utility/number.js";

export class StripeClient extends Client {
    public constructor(key: string) {
        const staticHeaders = {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": `Bearer ${key}`,
            "Stripe-Version": "2022-08-01"
        };
        super("https://api.stripe.com/", staticHeaders);
    }

    public async createSetupSession(callback: URL, userId: string, email: string): Promise<IStripeSession> {
        const data = new URLSearchParams({
            "mode": "setup",
            "payment_method_types[0]": "card",
            "payment_method_types[1]": "sepa_debit",
            "customer_email": email,
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

    public async postRefund(stripeId: string, amount: PreciseNumber): Promise<IStripeRefund> {
        const data = new URLSearchParams({
            payment_intent: stripeId,
            amount: amount.multipliedBy(100).toFixed(0),
            reason: "requested_by_customer"
        });
        const request = {
            endpoint: "v1/refunds",
            method: "POST",
            body: data.toString()
        };

        return this.request(request, StripeRefund);
    }

    public async detatchPaymentMethod(stripeId: string): Promise<void> {
        const request = {
            endpoint: `v1/payment_method/${stripeId}/detatch`,
            method: "POST"
        };
        await this.request(request, StripePaymentMethod);
    }
}
