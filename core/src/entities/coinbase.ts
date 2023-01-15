import { Schema } from "mongoose";
import { createModel } from "../utility/mongo.js";
import type { PreciseNumber } from "../utility/number.js";
import { PreciseNumberSchema } from "../utility/number.js";

export interface ICoinbaseProduct {
    id: string;
    base_currency: string;
    quote_currency: string;
    base_increment: PreciseNumber;
    quote_increment: PreciseNumber;
    post_only: boolean;
    cancel_only: boolean;
    status: string;
    auction_mode: boolean;
    trading_disabled: boolean;
}

export const CoinbaseProductSchema = new Schema<ICoinbaseProduct>({
    id: { type: String, required: true },
    base_currency: { type: String, required: true },
    quote_currency: { type: String, required: true },
    base_increment: { ...PreciseNumberSchema, required: true },
    quote_increment: { ...PreciseNumberSchema, required: true },
    post_only: { type: Boolean, required: true },
    cancel_only: { type: Boolean, required: true },
    status: { type: String, required: true },
    auction_mode: { type: Boolean, required: true },
    trading_disabled: { type: Boolean, default: false }
});

export const CoinbaseProduct = createModel<ICoinbaseProduct>(CoinbaseProductSchema);

export interface ICoinbaseProducts {
    list: Array<ICoinbaseProduct>;
}

export const CoinbaseProductsSchema = new Schema<ICoinbaseProducts>({
    list: { type: [CoinbaseProductSchema], default: undefined, required: true }
});

export const CoinbaseProducts = createModel<ICoinbaseProducts>(CoinbaseProductsSchema);

export interface ICoinbaseOrder {
    id: string;
    price: PreciseNumber;
    size: PreciseNumber;
    filled_size: PreciseNumber;
    status: string;
}

export const CoinbaseOrderSchema = new Schema<ICoinbaseOrder>({
    id: { type: String, required: true },
    price: { ...PreciseNumberSchema, required: true },
    size: { ...PreciseNumberSchema, required: true },
    filled_size: { ...PreciseNumberSchema, required: true },
    status: { type: String, required: true }
});

export const CoinbaseOrder = createModel<ICoinbaseOrder>(CoinbaseOrderSchema);

export interface ICoinbaseOrders {
    list: Array<ICoinbaseOrder>;
}

export const CoinbaseOrdersSchema = new Schema<ICoinbaseOrders>({
    list: { type: [CoinbaseOrderSchema], default: undefined, required: true }
});

export const CoinbaseOrders = createModel<ICoinbaseOrders>(CoinbaseOrdersSchema);

export interface ICoinbaseCancel {
    list: Array<string>;
}

export const CoinbaseCancelSchema = new Schema<ICoinbaseCancel>({
    list: { type: [String], default: undefined, required: true }
});

export const CoinbaseCancel = createModel<ICoinbaseCancel>(CoinbaseCancelSchema);

export interface ICoinbaseAccount {
    id: string;
    currency: string;
    available: PreciseNumber;
}

export const CoinbaseAccountSchema = new Schema<ICoinbaseAccount>({
    id: { type: String, required: true },
    currency: { type: String, required: true },
    available: { ...PreciseNumberSchema, required: true }
});

export const CoinbaseAccount = createModel<ICoinbaseAccount>(CoinbaseAccountSchema);

export interface ICoinbaseAccounts {
    list: Array<ICoinbaseAccount>;
}

export const CoinbaseAccountsSchema = new Schema<ICoinbaseAccounts>({
    list: { type: [CoinbaseAccountSchema], default: undefined, required: true }
});

export const CoinbaseAccounts = createModel<ICoinbaseAccounts>(CoinbaseAccountsSchema);

export interface ICoinbaseBook {
    sequence: PreciseNumber;
    bids: [[PreciseNumber, PreciseNumber, number]];
    asks: [[PreciseNumber, PreciseNumber, number]];
}

export const CoinbaseBookSchema = new Schema<ICoinbaseBook>({
    sequence: { ...PreciseNumberSchema, required: true },
    bids: { type: [[PreciseNumberSchema, PreciseNumberSchema, Number]], default: undefined, required: true },
    asks: { type: [[PreciseNumberSchema, PreciseNumberSchema, Number]], default: undefined, required: true }
});

export const CoinbaseBook = createModel<ICoinbaseBook>(CoinbaseBookSchema);
