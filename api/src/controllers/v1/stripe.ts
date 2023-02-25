import type { IStripeEvent, IStripePaymentMethodDetail } from "jewl-core";
import { StripeEvent, StripeCompletedSession, validate, StripePayment, PaymentMethod } from "jewl-core";
import { Body, Hidden, Post, Route, Security, SuccessResponse } from "tsoa";
import { validateBody } from "../../modules/mongo.js";
import { stripeClient } from "../../modules/network.js";

const handlers: Record<string, (data: object) => Promise<void>> = {
    handleCheckoutSessionCompleted: async (data: object): Promise<void> => {
        const body = await validateBody(StripeCompletedSession, data);
        const paymentMethod = await stripeClient.getPaymentMethod(body.customer);
        const details = (paymentMethod as unknown as Record<string, IStripePaymentMethodDetail>)[paymentMethod.type];
        const stripe = new PaymentMethod({
            userId: body.client_reference_id,
            customerId: body.customer,
            paymentId: paymentMethod.id,
            type: paymentMethod.type,
            subtype: details?.brand ?? details?.bank_name ?? details?.bank_name ?? details?.bank,
            last4: details?.last4
        });
        await stripe.save();
    },

    handlePaymentintentSucceeded: async (data: object): Promise<void> => {
        const _ = data;
        // TODO: <-
        return Promise.resolve();
    },

    handlePaymentintentPaymentfailed: async (data: object): Promise<void> => {
        const _ = await validateBody(StripePayment, data);
        // TODO: <- block access to user
        return Promise.resolve();
    }

};

@Route("/v1/stripe")
@Security("stripe")
@Hidden()
export class StripeController {

    /**
        Endpoint for handling stripe webhooks. This endpoint can and should only be called
        by Stripe. Any other call to this endoint will be rejected.
    **/
    @Post("/")
    @SuccessResponse("204")
    public async receivedStripeWebhook(@Body() body: IStripeEvent): Promise<void> {
        await validate(StripeEvent, body);
        const eventType = body.type
            .split(".")
            .map(x => x.charAt(0).toUpperCase() + x.slice(1))
            .join("")
            .replace(/[^A-Za-z]/ug, "");

        const handler = handlers[`handle${eventType}`];
        if (handler == null) { return; }
        await handler(body.data.object as object);
    }
}
