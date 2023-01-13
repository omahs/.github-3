import { Schema } from "mongoose";
import { createModel } from "../utility/mongo.js";
import { URLSchema } from "../utility/url.js";

export interface IStripeSessionResponse {
    url: URL;
}

export const StripeSessionResponseSchema = new Schema<IStripeSessionResponse>({
    url: { ...URLSchema, required: true }
});

export const StripeSessionResponse = createModel<IStripeSessionResponse>(StripeSessionResponseSchema);
