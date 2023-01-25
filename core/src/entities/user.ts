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

export interface IAllocationItem {
    currency: string;
    percentage: PreciseNumber;
    address: string;
}

export const AllocationItemSchema = new Schema<IAllocationItem>({
    currency: { type: String, required: true },
    percentage: { ...PreciseNumberSchema, required: true },
    address: { type: String, required: true }
});

export const AllocationItem = createModel<IAllocationItem>(AllocationItemSchema);

export interface IAllocation {
    userId: string;
    allocation: Array<IAllocationItem>;
}

export const AllocationSchema = new Schema<IAllocation>({
    userId: { type: String, required: true, unique: true },
    allocation: { type: [AllocationItemSchema], required: true }
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
    allocation: Array<IAllocationItem>;
}

export const AllocationRequestSchema = new Schema<IAllocationRequest>({
    allocation: { type: [AllocationItemSchema], required: true }
});

AllocationRequestSchema.pre("validate", allocationValidator);

export const AllocationRequest = createModel<IAllocationRequest>(AllocationRequestSchema);

export interface IAllocationResponse {
    allocation: Array<IAllocationItem>;
}

export const AllocationResponseSchema = new Schema<IAllocationResponse>({
    allocation: { type: [AllocationItemSchema], required: true }
});

AllocationResponseSchema.pre("validate", allocationValidator);

export const AllocationResponse = createModel<IAllocationResponse>(AllocationResponseSchema);
