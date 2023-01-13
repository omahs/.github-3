import { Body, Hidden, Post, Route, Security, SuccessResponse } from "tsoa";

@Route("/v1/stripe")
@Hidden()
export class StripeController {

    @Post("/")
    @Security("stripe")
    @SuccessResponse("204")
    public receivedStripeWebhook(@Body() body: object): void {
        console.log(body);


        // Listen checkout.session.completed webhook for created a payment method
        // Get the client reference id and setup intent id
        // Use that to get the payment method id
        // Store that in db
    }
}
