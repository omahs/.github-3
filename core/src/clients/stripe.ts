import type { IStripeCharge, IStripePayment, IStripePaymentMethod, IStripeRefund, IStripeSession } from "../entities/stripe.js";
import { StripePaymentMethods } from "../entities/stripe.js";
import { StripeRefund, StripeSession, StripeDelete, StripePayment, StripeCharge } from "../entities/stripe.js";
import { Client } from "../utility/client.js";
import type { PreciseNumber } from "../utility/number.js";

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
            "mode": "setup",
            "payment_method_types[0]": "card",
            "payment_method_types[1]": "sepa_debit",
            "customer_creation": "always",
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

    public async postRefund(paymentId: string, amount: PreciseNumber): Promise<IStripeRefund> {
        const data = new URLSearchParams({
            payment_intent: paymentId,
            amount: amount.multipliedBy(100).toFixed(0, 3),
            reason: "requested_by_customer"
        });
        const request = {
            endpoint: "v1/refunds",
            method: "POST",
            body: data.toString()
        };

        return this.request(request, StripeRefund);
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

    public async createPayment(customerId: string, paymentMethodId: string, amount: PreciseNumber): Promise<IStripePayment> {
        const data = new URLSearchParams({
            customer: customerId,
            payment_method: paymentMethodId,
            amount: amount.multipliedBy(100).toFixed(0, 3),
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

    public async retrieveCharge(chargeId: string): Promise<IStripeCharge> {
        const request = {
            endpoint: `v1/charges/${chargeId}?expand[0]=balance_transaction`
        };
        return this.request(request, StripeCharge);
    }
}
