import { Schema } from "mongoose";
import { createModel } from "../utility/mongo.js";
import type { PreciseNumber } from "../utility/number.js";
import { PreciseNumberSchema } from "../utility/number.js";
import { URLSchema } from "../utility/url.js";

export interface IStripe {
    userId: string;
    customerId: string;
    paymentId: string;
    paymentType: string;
}

export const StripeSchema = new Schema<IStripe>({
    userId: { type: String, required: true, unique: true },
    customerId: { type: String, required: true, unique: true },
    paymentId: { type: String, required: true, unique: true },
    paymentType: { type: String, required: true }
});

export const Stripe = createModel<IStripe>(StripeSchema, "stripes");

export interface IAllocation {
    userId: string;
    addresses: Record<string, string>;
    allocation: Record<string, PreciseNumber>;
}

export const AllocationSchema = new Schema<IAllocation>({
    userId: { type: String, required: true, unique: true },
    addresses: { type: Map, of: String, required: true },
    allocation: { type: Map, of: PreciseNumberSchema, required: true }
});

/* eslint-disable @typescript-eslint/no-invalid-this */
AllocationSchema.pre("validate", function(next) {
    if (Object.keys(this.allocation).length < 1) { this.invalidate("allocation", "empty allocation"); }
    for (const key in this.allocation) {
        if (this.addresses[key] === null) {
            this.invalidate("addresses", `address for ${key} missing`);
        }
    }
    next();
});
/* eslint-enable @typescript-eslint/no-invalid-this */

export const Allocation = createModel<IAllocation>(AllocationSchema, "allocations");

export interface IPaymentMethodSetupRequest {
    callback: URL;
}

export const PaymentMethodSetupRequestSchema = new Schema<IPaymentMethodSetupRequest>({
    callback: { ...URLSchema, required: true }
});

export const PaymentMethodSetupRequest = createModel<IPaymentMethodSetupRequest>(PaymentMethodSetupRequestSchema);

export interface IPaymentMethodSetupResponse {
    redirect: URL;
}

export const PaymentMethodSetupResponseSchema = new Schema<IPaymentMethodSetupResponse>({
    redirect: { ...URLSchema, required: true }
});

export const PaymentMethodSetupResponse = createModel<IPaymentMethodSetupResponse>(PaymentMethodSetupResponseSchema);

export interface IPaymentMethodResponse {
    connected: boolean;
}

export const PaymentMethodResponseSchema = new Schema<IPaymentMethodResponse>({
    connected: { type: Boolean, required: true }
});

export const PaymentMethodResponse = createModel<IPaymentMethodResponse>(PaymentMethodResponseSchema);
