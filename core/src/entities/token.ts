import { Schema } from "mongoose";
import { createModel } from "../utility/mongo.js";
import type { PreciseNumber } from "../utility/number.js";
import { PreciseNumberSchema } from "../utility/number.js";

export interface ITokenResponse {
    coinbaseId: string;
}

export const TokenResponseSchema = new Schema<ITokenResponse>({
    coinbaseId: { type: String, required: true }
});

export interface ITokensResponse {
    tokens: Array<ITokenResponse>;
    suggestedSplit: Record<string, PreciseNumber>;
}

export const TokensResponseSchema = new Schema<ITokensResponse>({
    tokens: { type: [TokenResponseSchema], default: undefined, required: true },
    suggestedSplit: { type: Map, of: PreciseNumberSchema, required: true }
});

export const TokensResponse = createModel<ITokensResponse>(TokensResponseSchema);


