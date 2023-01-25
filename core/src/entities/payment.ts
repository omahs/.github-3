import { Schema } from "mongoose";
import { DateTime } from "../utility/date.js";
import { DateTimeSchema } from "../utility/date.js";
import { createModel } from "../utility/mongo.js";
import { PreciseNumber, PreciseNumberSchema } from "../utility/number.js";

export enum OrderPeriod {
    daily = 1,
    weekly = 7,
    biweekly = 14,
    quadweekly = 28
}

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
    fee?: PreciseNumber;
}

export const PaymentSchema = new Schema<IPayment>({
    userId: { type: String, required: true, sparse: true },
    stripeId: { type: String, required: true, sparse: true },
    state: { type: Number, enum: PaymentState, required: true },
    notBefore: { ...DateTimeSchema, default: new DateTime() },
    amount: { ...PreciseNumberSchema, required: true },
    installments: { type: Number, required: true, min: 1, max: 12 },
    period: { type: Number, enum: OrderPeriod, required: true },
    fee: { ...PreciseNumberSchema }
});

export const Payment = createModel<IPayment>(PaymentSchema, "payments");

export interface IPaymentRequest {
    amount: PreciseNumber;
    installments: number;
    period: OrderPeriod;
    autoRenew: boolean;
}

export const PaymentRequestSchema = new Schema<IPaymentRequest>({
    amount: { ...PreciseNumberSchema, required: true },
    installments: { type: Number, required: true, min: 1, max: 12 },
    period: { type: Number, enum: OrderPeriod, required: true },
    autoRenew: { type: Boolean, required: true }
});

/* eslint-disable @typescript-eslint/no-invalid-this */
PaymentRequestSchema.pre("validate", function(next) {
    const totalTerm = new PreciseNumber(this.installments).multipliedBy(this.period);
    const multiplier = new PreciseNumber(356).div(totalTerm);
    const yearlyEquivalent = this.amount.div(multiplier);
    if (yearlyEquivalent.gte(1e5)) {
        this.invalidate("amount", "maximum amount of 100k per year exceeded");
    }
    next();
});
/* eslint-enable @typescript-eslint/no-invalid-this */

export const PaymentRequest = createModel<IPaymentRequest>(PaymentRequestSchema);

export interface IPaymentResponse {
    amount: PreciseNumber;
    installments: number;
    period: OrderPeriod;
    autoRenew: boolean;
    isActive: boolean;
}

export const PaymentResponseSchema = new Schema<IPaymentResponse>({
    amount: { ...PreciseNumberSchema, required: true },
    installments: { type: Number, required: true, min: 1, max: 12 },
    period: { type: Number, enum: OrderPeriod, required: true },
    autoRenew: { type: Boolean, required: true },
    isActive: { type: Boolean, required: true }
});

export const PaymentResponse = createModel<IPaymentResponse>(PaymentResponseSchema);
