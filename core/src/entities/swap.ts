import { Schema } from "mongoose";
import { createModel, estimateValidator } from "../utility/mongo.js";
import type { PreciseNumber } from "../utility/number.js";
import { PreciseNumberSchema } from "../utility/number.js";

export interface ICurrencyResponseItem {
    name: string;
    coin: string;
    requiresMemo: boolean;
    addressRegex?: string;
    memoRegex?: string;
    min: PreciseNumber;
    max: PreciseNumber;
    multiple: PreciseNumber;
}

export const CurrencyResponseItemSchema = new Schema<ICurrencyResponseItem>({
    name: { type: String, required: true },
    coin: { type: String, required: true },
    requiresMemo: { type: Boolean, required: true },
    addressRegex: { type: String },
    memoRegex: { type: String },
    min: { ...PreciseNumberSchema, required: true },
    max: { ...PreciseNumberSchema, required: true },
    multiple: { ...PreciseNumberSchema, required: true }
});

export const CurrencyResponseItem = createModel<ICurrencyResponseItem>(CurrencyResponseItemSchema);

export interface ICurrencyResponse {
    currencies: Array<ICurrencyResponseItem>;
}

export const CurrencyResponseSchema = new Schema<ICurrencyResponse>({
    currencies: { type: [CurrencyResponseItemSchema], required: true }
});

export const CurrencyResponse = createModel<ICurrencyResponse>(CurrencyResponseSchema);


export interface IEstimateRequestItem {
    currency: string;
    percentage?: PreciseNumber;
    amount?: PreciseNumber;
}

export const EstimateRequestItemSchema = new Schema<IEstimateRequestItem>({
    currency: { type: String, required: true },
    percentage: { ...PreciseNumberSchema },
    amount: { ...PreciseNumberSchema }
});

export const EstimateRequestItem = createModel<IEstimateRequestItem>(EstimateRequestItemSchema);

export interface IEstimateRequest {
    input: IEstimateRequestItem;
    output: Array<IEstimateRequestItem>;
}

const EstimateRequestSchema = new Schema<IEstimateRequest>({
    input: { type: EstimateRequestItemSchema, required: true },
    output: { type: [EstimateRequestItemSchema], required: true }
});

EstimateRequestSchema.pre("validate", estimateValidator);

export const EstimateRequest = createModel<IEstimateRequest>(EstimateRequestSchema);

export interface IEstimateResponseItem {
    currency: string;
    amount: PreciseNumber;
    usdEquivalent: PreciseNumber;
}

export const EstimateResponseItemSchema = new Schema<IEstimateResponseItem>({
    currency: { type: String, required: true },
    amount: { ...PreciseNumberSchema, required: true },
    usdEquivalent: { ...PreciseNumberSchema, required: true }
});

export const EstimateResponseItem = createModel<IEstimateResponseItem>(EstimateResponseItemSchema);

export interface IEstimateResponse {
    input: IEstimateResponseItem;
    output: Array<IEstimateResponseItem>;
    fee: PreciseNumber;
    deliveryTime: number;
}

const EstimateResponseSchema = new Schema<IEstimateResponse>({
    input: { type: EstimateResponseItemSchema, required: true },
    output: { type: [EstimateResponseItemSchema], required: true },
    fee: { ...PreciseNumberSchema, required: true },
    deliveryTime: { type: Number, required: true }
});

export const EstimateResponse = createModel<IEstimateResponse>(EstimateResponseSchema);
