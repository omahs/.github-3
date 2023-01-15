import { Schema } from "mongoose";
import { createModel } from "../utility/mongo.js";

export interface IAuthToken {
    access_token: string;
    token_type: string;
}

export const AuthTokenSchema = new Schema<IAuthToken>({
    access_token: { type: String, required: true },
    token_type: { type: String, required: true }
});

export const AuthToken = createModel<IAuthToken>(AuthTokenSchema);

export interface IAuthUser {
    email: string;
    email_verified: boolean;
    multifactor: Array<string>;
}

export const AuthUserSchema = new Schema<IAuthUser>({
    email: { type: String, required: true },
    email_verified: { type: Boolean, required: true },
    multifactor: { type: [String], required: true }
});

export const AuthUser = createModel<IAuthUser>(AuthUserSchema);
