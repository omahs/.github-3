import { Schema } from "mongoose";
import { createModel } from "../utility/mongo.js";
import type { PreciseNumber } from "../utility/number.js";
import { PreciseNumberSchema } from "../utility/number.js";
import { URLSchema } from "../utility/url.js";

export enum TransferState {
    initiated = 0,
    completed = 1,
    failed = 2
}

export interface ITransfer {
    userId: string;
    orderId: string;
    coinbaseId?: string;
    state: TransferState;
    currency: string;
    amount: PreciseNumber;
    price: PreciseNumber;
    destination: string;
    fee?: PreciseNumber;
    receipt?: URL;
}

export const TransferSchema = new Schema<ITransfer>({
    userId: { type: String, required: true },
    orderId: { type: String, required: true },
    coinbaseId: { type: String },
    state: { type: Number, enum: TransferState, required: true },
    currency: { type: String, required: true },
    amount: { ...PreciseNumberSchema, required: true },
    price: { ...PreciseNumberSchema, required: true },
    destination: { type: String, required: true },
    fee: { ...PreciseNumberSchema },
    receipt: { ...URLSchema }
});

export const Transfer = createModel<ITransfer>(TransferSchema, "transfers");
