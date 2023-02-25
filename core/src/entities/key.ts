import { Schema } from "mongoose";
import { createModel } from "../utility/mongo.js";

export interface IKey {
    userId: string;
    key: string;
}

export const KeySchema = new Schema<IKey>({
    userId: { type: String, required: true, unique: true },
    key: { type: String, required: true }
});

export const Key = createModel<IKey>(KeySchema, "keys");

export interface IKeyResponse {
    key: string;
}

export const KeyResponseSchema = new Schema<IKeyResponse>({
    key: { type: String, required: true }
});

export const KeyResponse = createModel<IKeyResponse>(KeyResponseSchema);


