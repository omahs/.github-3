import { Schema } from "mongoose";
import { createModel } from "../utility/mongo.js";
import { URLSchema } from "../utility/url.js";

export interface IStripePaymentMethod {
    id: string;
}

export const StripePaymentMethodSchema = new Schema<IStripePaymentMethod>({
    id: { type: String, required: true }
});

export const StripePaymentMethod = createModel<IStripePaymentMethod>(StripePaymentMethodSchema);

export interface IStripeSession {
    url: URL;
}

export const StripeSessionSchema = new Schema<IStripeSession>({
    url: { ...URLSchema, required: true }
});

export const StripeSession = createModel<IStripeSession>(StripeSessionSchema);

export interface IStripeRefund {
    id: string;
}

export const StripeRefundSchema = new Schema<IStripeRefund>({
    id: { type: String, required: true }
});

export const StripeRefund = createModel<IStripeRefund>(StripeRefundSchema);
