import { Schema } from "mongoose";
import { createModel } from "../utility/mongo.js";

export const NoResponseSchema = new Schema<object>({});
export const NoResponse = createModel<object>(NoResponseSchema);
