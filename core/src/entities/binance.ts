import type { PreciseNumber } from "../utility/number.js";
import { PreciseNumberSchema } from "../utility/number.js";
import { Schema } from "mongoose";
import { createModel } from "../utility/mongo.js";

export interface IBinanceSymbolItem {
    symbol: string;
    price: PreciseNumber;
}

export const BinancePriceItemSchema = new Schema<IBinanceSymbolItem>({
    symbol: { type: String, required: true },
    price: { ...PreciseNumberSchema, required: true }
});

export const BinancePriceItem = createModel<IBinanceSymbolItem>(BinancePriceItemSchema);

export interface IBinanceSymbol {
    list: Array<IBinanceSymbolItem>;
}

export const BinancePriceSchema = new Schema<IBinanceSymbol>({
    list: { type: [BinancePriceItemSchema], required: true }
});

export const BinancePrice = createModel<IBinanceSymbol>(BinancePriceSchema);

export interface IBinanceNetworkItem {
    coin: string;
    depositEnable: boolean;
    isDefault: boolean;
    addressRegex?: string;
    memoRegex?: string;
    name: string;
    network: string;
    withdrawEnable: boolean;
    withdrawFee: PreciseNumber;
    withdrawIntegerMultiple: PreciseNumber;
    withdrawMax: PreciseNumber;
    withdrawMin: PreciseNumber;
    sameAddress: boolean;
    estimatedArrivalTime: number;
}

export const BinanceNetworkItemSchema = new Schema<IBinanceNetworkItem>({
    coin: { type: String, required: true },
    depositEnable: { type: Boolean, required: true },
    isDefault: { type: Boolean, required: true },
    addressRegex: { type: String },
    memoRegex: { type: String },
    name: { type: String, required: true },
    network: { type: String, required: true },
    withdrawEnable: { type: Boolean, required: true },
    withdrawFee: { ...PreciseNumberSchema, required: true },
    withdrawIntegerMultiple: { ...PreciseNumberSchema, required: true },
    withdrawMax: { ...PreciseNumberSchema, required: true },
    withdrawMin: { ...PreciseNumberSchema, required: true },
    sameAddress: { type: Boolean, required: true },
    estimatedArrivalTime: { type: Number, required: true }
});

export const BinanceNetworkItem = createModel<IBinanceNetworkItem>(BinanceNetworkItemSchema);

export interface IBinanceCoinItem {
    coin: string;
    name: string;
    isLegalMoney: boolean;
    networkList: Array<IBinanceNetworkItem>;
}

export const BinanceCoinItemSchema = new Schema<IBinanceCoinItem>({
    coin: { type: String, required: true },
    name: { type: String, required: true },
    isLegalMoney: { type: Boolean, required: true },
    networkList: { type: [BinanceNetworkItemSchema], required: true }
});

export const BinanceCoinItem = createModel<IBinanceCoinItem>(BinanceCoinItemSchema);

export interface IBinanceCoin {
    list: Array<IBinanceCoinItem>;
}

export const BinanceCoinSchema = new Schema<IBinanceCoin>({
    list: { type: [BinanceCoinItemSchema], required: true }
});

export const BinanceCoin = createModel<IBinanceCoin>(BinanceCoinSchema);

export interface IBinanceAddress {
    address: string;
    tag?: string;
}

export const BinanceAddressSchema = new Schema<IBinanceAddress>({
    address: { type: String, required: true },
    tag: { type: String }
});

export const BinanceAddress = createModel<IBinanceAddress>(BinanceAddressSchema);
