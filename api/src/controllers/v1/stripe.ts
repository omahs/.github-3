import type { IStripeEvent } from "jewl-core";
import { StripeEvent } from "jewl-core";
import { Body, Controller, Hidden, Post, Route, Security, SuccessResponse, Response } from "tsoa";
import { validateBody } from "../../modules/mongo.js";

/**
    Handle a checkout-session-completed Stripe webhook.
**/
const onCheckoutSessionCompleted = async (data: object): Promise<void> => {
    const _ = data;
    // TODO: <-
    return Promise.resolve();
};

/**
    Handle a payment-intent-succeeded Stripe webhook.
**/
const onPaymentintentSucceeded = async (data: object): Promise<void> => {
    const _ = data;
    // TODO: <-
    return Promise.resolve();
};

/**
    Handle a payment-intent-payment-failed Stripe webhook.
**/
const onPaymentintentPaymentfailed = async (data: object): Promise<void> => {
    const _ = data;
    // TODO: <- block access to user
    return Promise.resolve();
};

/**
    An object containing all the webhook handlers.
**/
const handlers: Record<string, (data: object) => Promise<void>> = {
    onCheckoutSessionCompleted,
    onPaymentintentSucceeded,
    onPaymentintentPaymentfailed
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
            .split(".")
            .map(x => x.charAt(0).toUpperCase() + x.slice(1))
            .join("")
            .replace(/[^A-Za-z]/ug, "");

        const key = `on${eventType}`;
        if (!Object.hasOwn(handlers, key)) { return; }
        await handlers[key](validatedBody.data.object as object);
    }
}
