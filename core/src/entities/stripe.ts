import { Schema } from "mongoose";
import { createModel } from "../utility/mongo.js";
import { URLSchema } from "../utility/url.js";

export interface IStripeCharge {
    id: string;
}

export const StripeChargeSchema = new Schema<IStripeCharge>({
    id: { type: String, required: true }
});

export const StripeCharge = createModel<IStripeCharge>(StripeChargeSchema);

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

export interface IStripeDelete {
    id: string;
    deleted: boolean;
}

export const StripeDeleteSchema = new Schema<IStripeDelete>({
    id: { type: String, required: true },
    deleted: { type: Boolean, required: true }
});

export const StripeDelete = createModel<IStripeDelete>(StripeDeleteSchema);
