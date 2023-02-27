import type { IStripeEvent } from "jewl-core";
import { StripeEvent, StripeSessionCompleted, Subscription, StripeSubscriptionDeleted } from "jewl-core";
import { Body, Controller, Hidden, Post, Route, Security, SuccessResponse, Response } from "tsoa";
import { validateBody } from "../../modules/mongo.js";

/**
    Handle a checkout-session-completed Stripe event. This event is triggered
    when a user completes a checkout session (subscribe to jewl.app). This method
    Adds the subscription to the DB and activates the user.
**/
const onCheckoutSessionCompleted = async (data: object): Promise<void> => {
    const body = await validateBody(StripeSessionCompleted, data);
    const method = new Subscription({
        userId: body.client_reference_id,
        stripeId: body.customer
    });
    await method.save();
};

/**
    Handle a customer-subscription-deleted Stripe event. This event is
    triggered when a subscription is deleted (either manually or because
    of a failed payment or dispute). This method removes the subscription
    from the DB (if it exists).
**/
const onCustomerSubscriptionDeleted = async (data: object): Promise<void> => {
    const body = await validateBody(StripeSubscriptionDeleted, data);
    await Subscription.deleteOne({ stripeId: body.customer });
};

/**
    An object containing all the webhook handlers.
**/
const handlers: Record<string, (data: object) => Promise<void>> = {
    onCheckoutSessionCompleted,
    onCustomerSubscriptionDeleted
};

/**
    A controller for handling stripe webhook notifications.
**/
@Route("/v1/stripe")
@Security("stripe")
@Hidden()
@Response<string>(401, "Unauthorized")
@Response<string>(429, "Too many requests")
export class StripeController extends Controller {

    /**
        Endpoint for handling stripe webhooks. This endpoint can and should only be called
        by Stripe. Any other call to this endoint will be rejected.
    **/
    @Post("/")
    @SuccessResponse("204")
    public async receivedStripeWebhook(@Body() body: IStripeEvent): Promise<void> {
        const validatedBody = await validateBody(StripeEvent, body);
        const eventType = validatedBody.type
            .split(/\.|_/ug)
            .map(x => x.charAt(0).toUpperCase() + x.slice(1))
            .join("")
            .replace(/[^A-Za-z]/ug, "");

        const key = `on${eventType}`;
        if (!Object.hasOwn(handlers, key)) { return; }
        await handlers[key](validatedBody.data.object as object);
    }
}
