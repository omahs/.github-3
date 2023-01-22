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

export interface IStripeEvent {
    id: string;
    type: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: { object: any };
}

export const StripeEventSchema = new Schema<IStripeEvent>({
    id: { type: String, required: true },
    type: { type: String, required: true },
    data: { type: Object, required: true }
});

export const StripeEvent = createModel<IStripeEvent>(StripeEventSchema);

export interface IStripeCompletedSession {
    client_reference_id: string;
    customer: string;
}

export const StripeCompletedSessionSchema = new Schema<IStripeCompletedSession>({
    client_reference_id: { type: String, required: true },
    customer: { type: String, required: true }
});

export const StripeCompletedSession = createModel<IStripeCompletedSession>(StripeCompletedSessionSchema);
