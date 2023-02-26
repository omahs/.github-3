import { Schema } from "mongoose";
import { createModel } from "../utility/mongo.js";
import { URLSchema } from "../utility/url.js";

/**
    An interface for a user's payment information. This is an
    entity that is stored in the MongoDB.
**/
export interface ISubscription {

    /**
        The user's id that this key belongs to. This
        property is unique.
    **/
    userId: string;

    /**
        The stripe customerId assigned to this user. This
        property is unique as a user can only have one stripe
        id.
    **/
    stripeId: string;
}

/**
    A Model for validating the `IPaymentSetupRequest` interface.
**/
export const Subscription = createModel<ISubscription>(
    new Schema<ISubscription>({
        userId: { type: String, required: true, unique: true },
        stripeId: { type: String, required: true, unique: true }
    }),
    "subscriptions"
);

/**
    The request body for setting up a payment.
**/
export interface ISubscriptionSetupRequest {

    /**
        The callback url when the session completes.
    **/
    callback: URL;
}

/**
    A Model for validating the `IPaymentSetupRequest` interface.
**/
export const SubscriptionSetupRequest = createModel<ISubscriptionSetupRequest>(
    new Schema<ISubscriptionSetupRequest>({
        callback: { ...URLSchema, required: true }
    })
);

/**
    The response body for setting up a payment.
**/
export interface ISubscriptionSetupResponse {

    /**
        The redirect url to start the session.
    **/
    redirect: URL;
}

/**
    A Model for validating the `IPaymentSetupResponse` interface.
**/
export const SubscriptionSetupResponse = createModel<ISubscriptionSetupResponse>(
    new Schema<ISubscriptionSetupResponse>({
        redirect: { ...URLSchema, required: true }
    })
);
