import { Schema } from "mongoose";
import { createModel } from "../utility/mongo.js";
import type { PreciseNumber } from "../utility/number.js";
import { PreciseNumberSchema } from "../utility/number.js";
import { URLSchema } from "../utility/url.js";

export interface IStripeSession {
    url: URL;
}

export const StripeSessionSchema = new Schema<IStripeSession>({
    url: { ...URLSchema, required: true }
});

export const StripeSession = createModel<IStripeSession>(StripeSessionSchema);

export interface IStripeRefund {
    id: string;
    status: string;
}

export const StripeRefundSchema = new Schema<IStripeRefund>({
    id: { type: String, required: true },
    status: { type: String, required: true }
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

export interface IStripePayment {
    id: string;
    latest_charge?: string;
}

export const StripePaymentSchema = new Schema<IStripePayment>({
    id: { type: String, required: true },
    latest_charge: { type: String }
});

export const StripePayment = createModel<IStripePayment>(StripePaymentSchema);

export interface IStripeTransaction {
    fee: PreciseNumber;
}

export const StripeTransactionSchema = new Schema<IStripeTransaction>({
    fee: { ...PreciseNumberSchema, required: true }
});

export const StripeTransaction = createModel<IStripeTransaction>(StripeTransactionSchema);

export interface IStripeCharge {
    balance_transaction: IStripeTransaction;
}

export const StripeChargeSchema = new Schema<IStripeCharge>({
    balance_transaction: { type: StripeTransactionSchema, required: true }
});

export const StripeCharge = createModel<IStripeCharge>(StripeChargeSchema);

export interface IStripePaymentMethod {
    id: string;
    type: string;
}

export const StripePaymentMethodSchema = new Schema<IStripePaymentMethod>({
    id: { type: String, required: true },
    type: { type: String, required: true }
});

export const StripePaymentMethod = createModel<IStripePaymentMethod>(StripePaymentMethodSchema);

export interface IStripePaymentMethods {
    data: Array<IStripePaymentMethod>;
}

export const StripePaymentMethodsSchema = new Schema<IStripePaymentMethods>({
    data: { type: [StripePaymentMethodSchema], required: true }
});

export const StripePaymentMethods = createModel<IStripePaymentMethods>(StripePaymentMethodsSchema);
