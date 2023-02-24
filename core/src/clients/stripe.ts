import type { IStripePayment, IStripePaymentMethod, IStripeSession } from "../entities/stripe.js";
import { StripePaymentMethods, StripeSession, StripeDelete, StripePayment } from "../entities/stripe.js";
import { Client } from "../utility/client.js";

export class StripeClient extends Client {
    public constructor(url: string, key: string) {
        const staticHeaders = {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": `Bearer ${key}`,
            "Stripe-Version": "2022-11-15"
        };
        super(url, staticHeaders);
    }

    public async createSetupSession(callback: URL, userId: string, email: string): Promise<IStripeSession> {
        const data = new URLSearchParams({
            mode: "setup",
            customer_creation: "always",
            customer_email: email,
            client_reference_id: userId,
            success_url: callback.toString(),
            cancel_url: callback.toString()
        });
        const request = {
            endpoint: "v1/checkout/sessions",
            method: "POST",
            body: data.toString()
        };

        return this.request(request, StripeSession);
    }

    public async deleteCustomer(customerId: string): Promise<void> {
        const request = {
            endpoint: `v1/customers/${customerId}`,
            method: "DELETE"
        };
        const response = await this.request(request, StripeDelete).ignore(404);
        if (!(response?.deleted ?? true)) { throw new Error("user not deleted"); }
    }

    public async getPaymentMethod(customerId: string): Promise<IStripePaymentMethod> {
        const request = {
            endpoint: `v1/customers/${customerId}/payment_methods`
        };
        const response = await this.request(request, StripePaymentMethods);
        if (response.data.length < 1) { throw new Error("no payment methods found"); }
        return response.data[0];
    }

    public async createOffSessionPayment(customerId: string, paymentMethodId: string, amount: number): Promise<IStripePayment> {
        const data = new URLSearchParams({
            customer: customerId,
            payment_method: paymentMethodId,
            amount: amount.toString(),
            currency: "eur",
            confirm: "true",
            off_session: "true"
        });
        const request = {
            endpoint: "v1/payment_intents",
            method: "POST",
            body: data.toString()
        };
        return this.request(request, StripePayment);
    }
}
