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
    userId: string;
    paymentId: string;
    state: RefundState;
    amount?: PreciseNumber;
    stripeId?: string;
}

export const RefundSchema = new Schema<IRefund>({
    userId: { type: String, required: true, sparse: true },
    paymentId: { type: String, required: true, sparse: true },
    state: { type: Number, enum: RefundState, required: true },
    amount: { ...PreciseNumberSchema },
    stripeId: { type: String, sparse: true }
});

export const Refund = createModel<IRefund>(RefundSchema, "refunds");
