import { HttpError } from "./error.js";
import type { Model } from "mongoose";
import { validate } from "jewl-core";

export const validateBody = async <T>(schema: Model<T>, json: object): Promise<T> => {
    try {
        return await validate(schema, json);
    } catch (err) {
        if (err instanceof Error && err.name === "ValidationError") {
            throw new HttpError(400, err.message);
        }
        throw err;
    }
};
