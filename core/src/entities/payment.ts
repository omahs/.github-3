import { Schema } from "mongoose";
import { createModel } from "../utility/mongo.js";
import { URLSchema } from "../utility/url.js";

export interface IPaymentMethod {
    userId: string;
    customerId: string;
    paymentId: string;
    type: string;
    subtype?: string;
    last4?: string;
}

export const PaymentMethodSchema = new Schema<IPaymentMethod>({
    userId: { type: String, required: true, unique: true },
    customerId: { type: String, required: true, unique: true },
    paymentId: { type: String, required: true, unique: true },
    type: { type: String, required: true },
    subtype: { type: String },
    last4: { type: String }
});

export const PaymentMethod = createModel<IPaymentMethod>(PaymentMethodSchema, "paymentmethods");

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
    type: string;
    subtype?: string;
    last4?: string;
}

export const PaymentMethodResponseSchema = new Schema<IPaymentMethodResponse>({
    type: { type: String, required: true },
    subtype: { type: String },
    last4: { type: String }
});

export const PaymentMethodResponse = createModel<IPaymentMethodResponse>(PaymentMethodResponseSchema);
