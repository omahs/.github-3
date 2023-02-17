import type { PreciseNumber } from "../utility/number.js";
import { PreciseNumberSchema } from "../utility/number.js";
import { Schema } from "mongoose";
import { createModel } from "../utility/mongo.js";

export interface ICoin {
    name: string;
    coin: string;
    isBase: boolean;
    isDefault: boolean;
    requiresMemo: boolean;
    addressRegex?: string;
    memoRegex?: string;
    price: PreciseNumber;
    fee: PreciseNumber;
    min: PreciseNumber;
    max: PreciseNumber;
    multiple: PreciseNumber;
    deliveryTime: number;
}

export const CoinSchema = new Schema<ICoin>({
    name: { type: String, required: true, unique: true },
    coin: { type: String, required: true, index: true },
    isBase: { type: Boolean, required: true },
    isDefault: { type: Boolean, required: true },
    requiresMemo: { type: Boolean, required: true },
    addressRegex: { type: String },
    memoRegex: { type: String },
    price: { ...PreciseNumberSchema, required: true },
    fee: { ...PreciseNumberSchema, required: true },
    min: { ...PreciseNumberSchema, required: true },
    max: { ...PreciseNumberSchema, required: true },
    multiple: { ...PreciseNumberSchema, required: true },
    deliveryTime: { type: Number, required: true }
});

export const Coin = createModel<ICoin>(CoinSchema, "coins");
