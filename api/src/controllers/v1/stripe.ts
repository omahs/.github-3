import { StripeEvent, StripeCompletedSession, validate, User } from "jewl-core";
import type { IStripeEvent } from "jewl-core";
import { Body, Hidden, Post, Route, Security, SuccessResponse } from "tsoa";

const handlers: Record<string, (data: object) => Promise<void>> = {
    handleCheckoutSessionCompleted: async (data: object): Promise<void> => {
        const body = await validate(StripeCompletedSession, data);
        await User.updateOne({ userId: body.client_reference_id }, { stripeId: body.customer });
    },

    handlePaymentintentSucceeded: async (_: object): Promise<void> => {
        // Check if not already handled
        // Get stripe fee and add to payment
        // Set status for payment and store in db
        // Create orders
        // Send email
        return Promise.resolve();
    },

    handlePaymentintentPaymentfailed: async (_: object): Promise<void> => {
        // Check if not already handled
        // Set status for payment store in db
        // Send email
        return Promise.resolve();
    },

    handleRefundUpdated: async (_: object): Promise<void> => {
        // Listen for successful or failed refunds
        // Store in db the status
        // Send email
        return Promise.resolve();
    }

};

@Route("/v1/stripe")
@Hidden()
export class StripeController {
    @Post("/")
    @Security("stripe")
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
