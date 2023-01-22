import { StripeEvent, StripeCompletedSession, getOrCreateUser } from "jewl-core";
import type { IStripeEvent } from "jewl-core";
import { Body, Hidden, Post, Route, Security, SuccessResponse } from "tsoa";

const handlers: Record<string, (data: object) => Promise<void>> = {
    handleCheckoutSessionCompleted: async (data: object): Promise<void> => {
        const validatedData = new StripeCompletedSession(data);
        const user = await getOrCreateUser(validatedData.client_reference_id);
        user.stripeId = validatedData.customer;
        await user.save();
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
        const validatedBody = new StripeEvent(body);
        const eventType = validatedBody.type
            .split(".")
            .map(x => x.charAt(0).toUpperCase() + x.slice(1))
            .join("")
            .replace(/[^A-Za-z]/ug, "");

        const handler = handlers[`handle${eventType}`];
        if (handler == null) { return; }
        await handler(validatedBody.data);
    }
}
