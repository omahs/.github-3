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

/**
    An interface for the StripeSubscriptionDeleted event.
**/
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

/**
    An interface for the a Stripe subscription items response.
**/
export interface IStripeSubscriptionItem {

    /**
        The id of the subscription item.
    **/
    id: string;
}

/**
    A Model for validating the `IStripeSubscriptionItem` interface.
**/
export const StripeSubscriptionItem = createModel<IStripeSubscriptionItem>(
    new Schema<IStripeSubscriptionItem>({
        id: { type: String, required: true }
    })
);

/**
    An interface for the a Stripe subscription items response.
**/
export interface IStripeSubscriptionItems {

    /**
        The list of subscription items.
    **/
    data: Array<IStripeSubscriptionItem>;
}

/**
    A Model for validating the `IStripeSubscriptionItems` interface.
**/
export const StripeSubscriptionItems = createModel<IStripeSubscriptionItems>(
    new Schema<IStripeSubscriptionItems>({
        data: { type: [StripeSubscriptionItem.schema], required: true }
    })
);

/**
    An interface for the a Stripe subscription.
**/
export interface IStripeSubscription {

    /**
        The id of the subscription.
    **/
    id: string;

    /**
        An object that contains the list of subscription items.
    **/
    items: IStripeSubscriptionItems;
}

/**
    A Model for validating the `IStripeSubscription` interface.
**/
export const StripeSubscription = createModel<IStripeSubscription>(
    new Schema<IStripeSubscription>({
        id: { type: String, required: true },
        items: { type: StripeSubscriptionItems.schema, required: true }
    })
);

/**
    An interface for the a Stripe subscriptions response.
**/
export interface IStripeSubscriptions {

    /**
        The list of subscriptions.
    **/
    data: Array<IStripeSubscription>;
}

/**
    A Model for validating the `IStripeSubscriptions` interface.
**/
export const StripeSubscriptions = createModel<IStripeSubscriptions>(
    new Schema<IStripeSubscriptions>({
        data: { type: [StripeSubscription.schema], required: true }
    })
);

/**
    An interface for the a Stripe usage report update response.
**/
export interface IStripeUpdateUsage {

    /**
        The id of the update.
    **/
    id: string;
}

/**
    A Model for validating the `IStripeUpdateUsage` interface.
**/
export const StripeUpdateUsage = createModel<IStripeUpdateUsage>(
    new Schema<IStripeUpdateUsage>({
        id: { type: String, required: true }
    })
);
