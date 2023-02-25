import { Schema } from "mongoose";
import { createModel } from "../utility/mongo.js";

/**
    An interface for a user's api key. This is an
    entity that is stored in the MongoDB.
**/
export interface IKey {

    /**
        The user's id that this key belongs to. This
        property is unique as a user can only have one api
        key assigned to their user.
    **/
    userId: string;

    /**
        The actual key. This property is unique as api
        key collisions are bad.
    **/
    key: string;
}

/**
    A Model for validating the `IKey` interface.
**/
export const Key = createModel<IKey>(
    new Schema<IKey>({
        userId: { type: String, required: true, unique: true },
        key: { type: String, required: true, unique: true }
    }),
    "keys"
);

/**
    An api key response.
**/
export interface IKeyResponse {

    /**
        The actual api key.
    **/
    key: string;
}

/**
    A Model for validating the `IKeyResponse` interface.
**/
export const KeyResponse = createModel<IKeyResponse>(
    new Schema<IKeyResponse>({
        key: { type: String, required: true }
    })
);


