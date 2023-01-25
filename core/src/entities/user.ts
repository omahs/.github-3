import { Schema } from "mongoose";
import { allocationValidator, createModel } from "../utility/mongo.js";
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
    percentages: Record<string, PreciseNumber>;
}

export const AllocationSchema = new Schema<IAllocation>({
    userId: { type: String, required: true, unique: true },
    addresses: { type: Map, of: String, required: true },
    percentages: { type: Map, of: PreciseNumberSchema, required: true }
});

AllocationSchema.pre("validate", allocationValidator);

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

export interface IAllocationRequest {
    addresses: Record<string, string>;
    percentages: Record<string, PreciseNumber>;
}

export const AllocationRequestSchema = new Schema<IAllocationRequest>({
    addresses: { type: Map, of: String, required: true },
    percentages: { type: Map, of: PreciseNumberSchema, required: true }
});

AllocationRequestSchema.pre("validate", allocationValidator);

export const AllocationRequest = createModel<IAllocationRequest>(AllocationRequestSchema);

export interface IAllocationResponse {
    addresses: Record<string, string>;
    percentages: Record<string, PreciseNumber>;
}

export const AllocationResponseSchema = new Schema<IAllocationResponse>({
    addresses: { type: Map, of: String, required: true },
    percentages: { type: Map, of: PreciseNumberSchema, required: true }
});

AllocationResponseSchema.pre("validate", allocationValidator);

export const AllocationResponse = createModel<IAllocationResponse>(AllocationResponseSchema);
