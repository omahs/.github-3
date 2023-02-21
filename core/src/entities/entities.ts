import type { PreciseNumber } from "../utility/number.js";
import { PreciseNumberSchema } from "../utility/number.js";
import { Schema } from "mongoose";
import { createModel } from "../utility/mongo.js";

export interface IPrice {
    coin: string;
    isBase: boolean;
    price: PreciseNumber;
}

export const PriceSchema = new Schema<IPrice>({
    coin: { type: String, required: true, unique: true },
    isBase: { type: Boolean, required: true },
    price: { ...PreciseNumberSchema, required: true }
});

export const Price = createModel<IPrice>(PriceSchema, "prices");

export interface ICurrency {
    coin: string;
    name: string;
    network: string;
    networkName: string;
    isDefault: boolean;
    requiresMemo: boolean;
    addressRegex?: string;
    memoRegex?: string;
    fee: PreciseNumber;
    min: PreciseNumber;
    max: PreciseNumber;
    multiple: PreciseNumber;
    deliveryTime: number;
}

export const CurrencySchema = new Schema<ICurrency>({
    coin: { type: String, required: true, index: true },
    name: { type: String, required: true },
    network: { type: String, required: true, index: true },
    networkName: { type: String, required: true },
    isDefault: { type: Boolean, required: true },
    requiresMemo: { type: Boolean, required: true },
    addressRegex: { type: String },
    memoRegex: { type: String },
    fee: { ...PreciseNumberSchema, required: true },
    min: { ...PreciseNumberSchema, required: true },
    max: { ...PreciseNumberSchema, required: true },
    multiple: { ...PreciseNumberSchema, required: true },
    deliveryTime: { type: Number, required: true }
});

export const Currency = createModel<ICurrency>(CurrencySchema, "currencies");

export interface IAddress {
    coin: string;
    network: string;
    address: string;
    memo?: string;
}

export const AddressSchema = new Schema<IAddress>({
    coin: { type: String, required: true, index: true },
    network: { type: String, required: true, index: true },
    address: { type: String, required: true },
    memo: { type: String }
});

export const Address = createModel<IAddress>(AddressSchema, "addresses");
