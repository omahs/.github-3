import { Schema } from "mongoose";
import { createModel } from "../utility/mongo.js";
import type { PreciseNumber } from "../utility/number.js";
import { PreciseNumberSchema } from "../utility/number.js";

export enum RefundState {
    pending = 0,
    initiated = 1,
    completed = 2,
    failed = 3
}

export interface IRefund {
    paymentId: string;
    state: RefundState;
    amount?: PreciseNumber;
    stripeId?: string;
}

export const RefundSchema = new Schema<IRefund>({
    paymentId: { type: String, required: true },
    state: { type: Number, enum: RefundState, required: true },
    amount: { ...PreciseNumberSchema },
    stripeId: { type: String }
});

export const Refund = createModel<IRefund>(RefundSchema, "refunds");
