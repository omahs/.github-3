import { Body, Hidden, Post, Route, Security, SuccessResponse } from "tsoa";

@Route("/v1/stripe")
@Hidden()
export class StripeController {

    @Post("/")
    @Security("stripe")
    @SuccessResponse("204")
    public receivedStripeWebhook(@Body() body: object): void {
        console.log(body);

        // TODO: \/
        // Listen checkout.session.completed webhook for created a payment method
        // Get the client reference id == userId
        // Use that to get the customerId == stripeId
        // Store that in db

        // Listen for successful or failed payments
        // Take fee off 1%
        // Take off stripe fee
        // Create orders

        // Listen for successful or failed refunds
        // Store in db the status
    }
}
