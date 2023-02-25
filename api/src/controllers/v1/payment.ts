import { Body, Delete, Get, Hidden, Post, Route, Security, Request, SuccessResponse, Controller, Response } from "tsoa";
import type { WithAuthentication } from "../../modules/auth.js";

/**
    A controller for managing payment methods.
**/
@Route("/v1/payment")
@Security("token")
@Hidden()
@Response<string>(401, "Unauthorized")
@Response<string>(429, "Too many requests")
export class PaymentController extends Controller {

    /**
        Get the currently logged in user's connected payment method.
    **/
    @Get("/")
    @SuccessResponse(200, "Success")
    @Response<string>(401, "Unauthorized")
    @Response<string>(404, "Not found")
    public async getPaymentMethod(@Request() _: WithAuthentication): Promise<void> {
        return Promise.resolve();
    }

    /**
        Get an url for setting up a stripe payment method.
    **/
    @Post("/")
    @SuccessResponse(200, "Success")
    @Response<string>(400, "Bad request")
    @Response<string>(403, "Forbidden")
    public async setupPaymentMethod(@Request() _0: WithAuthentication, @Body() _1: object): Promise<void> {
        return Promise.resolve();
    }

    /**
        Delete the currently logged in user's payment method.
    **/
    @Delete("/")
    @SuccessResponse(204, "No content")
    @Response<string>(404, "Not found")
    public async deletePaymentMethod(@Request() _: WithAuthentication): Promise<void> {
        return Promise.resolve();
    }
}
