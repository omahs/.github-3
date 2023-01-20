import { Schema } from "mongoose";
import type { DateTime } from "../utility/date.js";
import { DateTimeSchema } from "../utility/date.js";
import { createModel } from "../utility/mongo.js";
import { PreciseNumber, PreciseNumberSchema } from "../utility/number.js";

export enum OrderState {
    open = 0,
    fulfilled = 1,
    closed = 2
}

export interface IOrder {
    userId: string;
    paymentId: string;
    state: OrderState;
    notBefore: DateTime;
    currency: string;
    amount: PreciseNumber;
    destination: string;
}

export const OrderSchema = new Schema<IOrder>({
    userId: { type: String, required: true, sparse: true },
    paymentId: { type: String, required: true, sparse: true },
    state: { type: Number, enum: OrderState, required: true },
    notBefore: { ...DateTimeSchema, required: true },
    currency: { type: String, required: true },
    amount: { ...PreciseNumberSchema, required: true },
    destination: { type: String, required: true }
});

export const Order = createModel<IOrder>(OrderSchema, "orders");

export enum OrderPeriod {
    daily = 1,
    weekly = 7,
    biweekly = 14,
    quadweekly = 28
}

export interface IInitiateOrderRequest {
    amount: PreciseNumber;
    installments: number;
    period: OrderPeriod;
    autoRenew: boolean;
}

export const InitiateOrderRequestSchema = new Schema<IInitiateOrderRequest>({
    amount: { ...PreciseNumberSchema, required: true },
    installments: { type: Number, required: true, min: 1, max: 12 },
    period: { type: Number, enum: OrderPeriod, required: true },
    autoRenew: { type: Boolean, required: true }
});

/* eslint-disable @typescript-eslint/no-invalid-this */
InitiateOrderRequestSchema.pre("validate", function(next) {
    const totalTerm = new PreciseNumber(this.installments).multipliedBy(this.period);
    const multiplier = new PreciseNumber(356).div(totalTerm);
    const yearlyEquivalent = this.amount.div(multiplier);
    if (yearlyEquivalent.gte(1e5)) {
        this.invalidate("amount", "maximum amount of 100k per year exceeded");
    }
    next();
});
/* eslint-enable @typescript-eslint/no-invalid-this */

export const InitiateOrderRequest = createModel<IInitiateOrderRequest>(InitiateOrderRequestSchema);

export interface IOrderRenewResponse {
    enabled: boolean;
}

export const OrderRenewResponseSchema = new Schema<IOrderRenewResponse>({
    enabled: { type: Boolean, required: true }
});

export const OrderRenewResponse = createModel<IOrderRenewResponse>(OrderRenewResponseSchema);
