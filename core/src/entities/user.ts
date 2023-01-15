import { Schema } from "mongoose";
import { createModel } from "../utility/mongo.js";
import type { PreciseNumber } from "../utility/number.js";
import { PreciseNumberSchema } from "../utility/number.js";

export interface IUser {
    userId: string;
    stripeId?: string;
    addresses: Record<string, string>;
    allocation: Record<string, PreciseNumber>;
}

export const UserSchema = new Schema<IUser>({
    userId: { type: String, required: true },
    stripeId: { type: String },
    addresses: { type: Map, of: String, default: {} },
    allocation: { type: Map, of: PreciseNumberSchema, default: {} }
});

/* eslint-disable @typescript-eslint/no-invalid-this */
UserSchema.pre("validate", function(next) {
    for (const key in this.allocation) {
        if (this.addresses[key] === null) {
            this.invalidate("addresses", `address for ${key} missing`);
        }
    }
    next();
});
/* eslint-enable @typescript-eslint/no-invalid-this */

export const User = createModel<IUser>(UserSchema, "users");
