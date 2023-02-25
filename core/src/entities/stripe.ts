import { Schema } from "mongoose";
import { createModel } from "../utility/mongo.js";

/**
    A stripe event sent through the webhook url.
**/
export interface IStripeEvent {

    /**
        The id of the event.
    **/
    id: string;

    /**
        The type of the event.
    **/
    type: string;

    /**
        The additional of the event.
    **/
    data: { object: unknown };
}

/**
    A Model for validating the `IStripeEvent` interface.
**/
export const StripeEvent = createModel<IStripeEvent>(
    new Schema<IStripeEvent>({
        id: { type: String, required: true },
        type: { type: String, required: true },
        data: { type: Object, required: true }
    })
);
