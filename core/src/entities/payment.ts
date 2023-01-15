import { Schema } from "mongoose";
import type { DateTime } from "../utility/date.js";
import { DateTimeSchema } from "../utility/date.js";
import { createModel } from "../utility/mongo.js";
import type { PreciseNumber } from "../utility/number.js";
import { PreciseNumberSchema } from "../utility/number.js";
import { URLSchema } from "../utility/url.js";
import { OrderPeriod } from "./order.js";

export enum PaymentState {
    scheduled = 0,
    initiated = 1,
    completed = 2,
    failed = 3
}

export interface IPayment {
    userId: string;
    stripeId: string;
    state: PaymentState;
    notBefore: DateTime;
    amount: PreciseNumber;
    installments: number;
    period: OrderPeriod;
}

export const PaymentSchema = new Schema<IPayment>({
    userId: { type: String, required: true },
    stripeId: { type: String, required: true },
    state: { type: Number, enum: PaymentState, required: true },
    notBefore: { ...DateTimeSchema, required: true },
    amount: { ...PreciseNumberSchema, required: true },
    installments: { type: Number, required: true, min: 1, max: 12 },
    period: { type: Number, enum: OrderPeriod, required: true }
});

export const Payment = createModel<IPayment>(PaymentSchema, "payments");

export interface IPaymentSetupRequest {
    callback: URL;
}

export const PaymentSetupRequestSchema = new Schema<IPaymentSetupRequest>({
    callback: { ...URLSchema, required: true }
});

export const PaymentSetupRequest = createModel<IPaymentSetupRequest>(PaymentSetupRequestSchema);

export interface IPaymentSetupResponse {
    redirect: URL;
}

export const PaymentSetupResponseSchema = new Schema<IPaymentSetupResponse>({
    redirect: { ...URLSchema, required: true }
});

export const PaymentSetupResponse = createModel<IPaymentSetupResponse>(PaymentSetupResponseSchema);

export interface IPaymentResponse {
    connected: boolean;
}

export const PaymentResponseSchema = new Schema<IPaymentResponse>({
    connected: { type: Boolean, required: true }
});

export const PaymentResponse = createModel<IPaymentResponse>(PaymentResponseSchema);
