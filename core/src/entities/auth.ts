import { Schema } from "mongoose";
import { createModel } from "../utility/mongo.js";

/**
    An interface for an Auth0 AuthToken response. This is
    returned by Auth0 when requesting access to the management
    api.
**/
export interface IAuthToken {

    /**
        The access token itself.
    **/
    access_token: string;

    /**
        The type of the access token.
    **/
    token_type: string;
}

/**
    A Model for validating the `IAuthToken` interface.
**/
export const AuthToken = createModel<IAuthToken>(
    new Schema<IAuthToken>({
        access_token: { type: String, required: true },
        token_type: { type: String, required: true }
    })
);

/**
    An interface for an Auth0 user response. This is
    returned by Auth0 when requesting information about
    a user.
**/
export interface IAuthUser {

    /**
        The user's email address.
    **/
    email: string;

    /**
        Whether or not the user's email address is verified.
    **/
    email_verified: boolean;
}

/**
    A Model for validating the `IAuthUser` interface.
**/
export const AuthUser = createModel<IAuthUser>(
    new Schema<IAuthUser>({
        email: { type: String, required: true },
        email_verified: { type: Boolean, required: true }
    })
);
