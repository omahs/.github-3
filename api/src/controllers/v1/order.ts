import type { IInitiateOrderRequest } from "jewl-core";
import { Delete, Get, Route, Security, Post, Body, Request } from "tsoa";
import type { WithAuthentication } from "../../modules/auth.js";

@Route("/v1/order")
@Security("token")
export class OrderController {

    @Get("/")
    public getAllOrders(): void {
        console.log("A");
    }

    @Post("/")
    public initiateOrder(@Request() _: WithAuthentication, @Body() _1: IInitiateOrderRequest): void {
        // Const validatedBody = new InitiateOrderRequest(body);


        // Generate transactions and create stripe payment
        console.log("A");
    }

    @Delete("/")
    public cancelPendingTransactions(): void {
        console.log("A");

    }
}
