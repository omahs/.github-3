import { Schema } from "mongoose";
import { createModel } from "../utility/mongo.js";
import { URLSchema } from "../utility/url.js";

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


/**
    A stripe session created through the stripe api.
**/
export interface IStripeSession {

    /**
        The url to access the stripe session.
    **/
    url: URL;
}

/**
    A Model for validating the `IStripeSession` interface.
**/
export const StripeSession = createModel<IStripeSession>(
    new Schema<IStripeSession>({
        url: { ...URLSchema, required: true }
    })
);

/**
    A stripe session completed event response body.
**/
export interface IStripeSessionCompleted {

    /**
        The reference id assigned during creation of the session.
    **/
    client_reference_id: string;

    /**
        The stripe customer identifier.
    **/
    customer: string;
}

/**
    A Model for validating the `IStripeSessionCompleted` interface.
**/
export const StripeSessionCompleted = createModel<IStripeSessionCompleted>(
    new Schema<IStripeSessionCompleted>({
        client_reference_id: { type: String, required: true },
        customer: { type: String, required: true }
    })
);

/**
    A stripe customer deletion response body.
**/
export interface IStripeDelete {

    /**
        The id of the customer that got deleted.
    **/
    id: string;

    /**
        Whether or not the customer was actually deleted or not.
    **/
    deleted: boolean;
}

/**
    A Model for validating the `IStripeDelete` interface.
**/
export const StripeDelete = createModel<IStripeDelete>(
    new Schema<IStripeDelete>({
        id: { type: String, required: true },
        deleted: { type: Boolean, required: true }
    })
);

export interface IStripeSubscriptionDeleted {

    /**
        The stripe customer identifier.
    **/
    customer: string;
}

/**
    A Model for validating the `IStripeSubscriptionDeleted` interface.
**/
export const StripeSubscriptionDeleted = createModel<IStripeSubscriptionDeleted>(
    new Schema<IStripeSubscriptionDeleted>({
        customer: { type: String, required: true }
    })
);
