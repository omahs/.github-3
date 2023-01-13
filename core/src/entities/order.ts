import { Schema } from "mongoose";
import type { DateTime } from "../utility/date.js";
import { DateTimeSchema } from "../utility/date.js";
import { createModel } from "../utility/mongo.js";
import { PreciseNumber, PreciseNumberSchema } from "../utility/number.js";

enum OrderState {
    open = 0,
    fulfilled = 1,
    closed = 2
}

export interface IOrder {
    paymentId: string;
    state: OrderState;
    created: DateTime;
    currency: string;
    amount: PreciseNumber;
}

export const OrderSchema = new Schema<IOrder>({
    paymentId: { type: String, required: true },
    state: { type: Number, enum: OrderState, required: true },
    created: { ...DateTimeSchema, required: true },
    currency: { type: String, required: true },
    amount: { ...PreciseNumberSchema, required: true }
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
    split: Record<string, PreciseNumber>;
    terms: number;
    period: OrderPeriod;
}

export const InitiateOrderRequestSchema = new Schema<IInitiateOrderRequest>({
    amount: { ...PreciseNumberSchema, required: true },
    split: { type: Map, of: PreciseNumberSchema, required: true },
    terms: { type: Number, required: true, min: 1, max: 12 },
    period: { type: Number, enum: OrderPeriod, required: true }
});

/* eslint-disable @typescript-eslint/no-invalid-this */
InitiateOrderRequestSchema.pre("validate", function(next) {
    const multiplier = new PreciseNumber(356).div(this.period);
    const yearlyEquivalent = this.amount.div(multiplier);
    if (yearlyEquivalent.gte(1e5)) {
        this.invalidate("amount", "maximum amount of 100k per year exceeded");
    }
    next();
});
/* eslint-enable @typescript-eslint/no-invalid-this */

export const InitiateOrderRequest = createModel<IInitiateOrderRequest>(InitiateOrderRequestSchema);
