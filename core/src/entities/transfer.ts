import { Schema } from "mongoose";
import { createModel } from "../utility/mongo.js";
import type { PreciseNumber } from "../utility/number.js";
import { PreciseNumberSchema } from "../utility/number.js";
import { URLSchema } from "../utility/url.js";


export interface ITransfer {
    userId: string;
    orderId: string;
    currency: string;
    amount: PreciseNumber;
    price: PreciseNumber;
    destination: string;
    receipt?: URL;
}

export const TransferSchema = new Schema<ITransfer>({
    userId: { type: String, required: true },
    orderId: { type: String, required: true },
    currency: { type: String, required: true },
    amount: { ...PreciseNumberSchema, required: true },
    price: { ...PreciseNumberSchema, required: true },
    destination: { type: String, required: true },
    receipt: { ...URLSchema }
});

export const Transfer = createModel<ITransfer>(TransferSchema, "transfers");
