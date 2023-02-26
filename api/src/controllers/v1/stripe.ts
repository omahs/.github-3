import type { IStripeEvent } from "jewl-core";
import { StripeEvent, StripeSessionCompleted, Subscription } from "jewl-core";
import { Body, Controller, Hidden, Post, Route, Security, SuccessResponse, Response } from "tsoa";
import { validateBody } from "../../modules/mongo.js";

/**
    Handle a checkout-session-completed Stripe webhook.
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
    Generic wehbook for when subscription status changes.
**/
const onCustomerSubscriptionChanged = async (data: object): Promise<void> => {
    const _ = data;
    // TODO: <-
    // Actually only have to listen to subscriptions that failed or payments failed.
    return Promise.resolve();
};

/**
    An object containing all the webhook handlers.
**/
const handlers: Record<string, (data: object) => Promise<void>> = {
    onCheckoutSessionCompleted,
    onCustomerSubscriptionDeleted: onCustomerSubscriptionChanged,
    onCustomerSubscriptionCreated: onCustomerSubscriptionChanged,
    onCustomerSubscriptionUpdated: onCustomerSubscriptionChanged,
    onCustomerSubscriptionPaused: onCustomerSubscriptionChanged,
    onCustomerSubscriptionResumed: onCustomerSubscriptionChanged,
    onCustomerSubscriptionTrialWillEnd: onCustomerSubscriptionChanged,
    onCustomerSubscriptionPendingUpdateExpired: onCustomerSubscriptionChanged,
    onCustomerSubscriptionPendingUpdateApplied: onCustomerSubscriptionChanged
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
