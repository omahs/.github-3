import type { ISubscriptionSetupRequest, ISubscriptionSetupResponse } from "jewl-core";
import { SubscriptionSetupRequest, Subscription } from "jewl-core";
import { Body, Get, Hidden, Post, Route, Security, Request, SuccessResponse, Controller, Response, Delete } from "tsoa";
import type { WithAuthentication } from "../../modules/auth.js";
import { HttpError } from "../../modules/error.js";
import { validateBody } from "../../modules/mongo.js";
import { authClient, stripeClient } from "../../modules/network.js";

/**
    A controller for managing payment methods.
**/
@Route("/v1/subscription")
@Security("token")
@Hidden()
@Response<string>(401, "Unauthorized")
@Response<string>(429, "Too many requests")
export class SubscriptionController extends Controller {

    /**
        Get the currently logged in user's subscription and usage status.
    **/
    @Get("/")
    @SuccessResponse(200, "Success")
    @Response<string>(401, "Unauthorized")
    @Response<string>(404, "Not found")
    public async getUsage(@Request() _: WithAuthentication): Promise<void> {
        return Promise.resolve();
    }

    /**
        Get an url for setting up a stripe payment method.
    **/
    @Post("/")
    @SuccessResponse(200, "Success")
    @Response<string>(400, "Bad request")
    @Response<string>(403, "Forbidden")
    public async setupSubscriptionMethod(@Request() req: WithAuthentication, @Body() body: ISubscriptionSetupRequest): Promise<ISubscriptionSetupResponse> {
        const validatedBody = await validateBody(SubscriptionSetupRequest, body);
        const authUser = await authClient.getUser(req.user.userId);
        if (!authUser.email_verified) { throw new HttpError(403, "email address not verified"); }
        const subscription = await Subscription.findOne({ userId: req.user.userId });
        if (subscription != null) { throw new HttpError(400, "user already has a subscription"); }
        const setupSession = await stripeClient.createSetupSession(validatedBody.callback, req.user.userId, authUser.email);
        return { redirect: setupSession.url };
    }

    @Delete("/")
    @SuccessResponse(204, "Success")
    @Response<string>(404, "Not found")
    public async deleteSubscriptionMethod(@Request() req: WithAuthentication): Promise<void> {
        const subscription = await Subscription.findOne({ userId: req.user.userId });
        if (subscription == null) { throw new HttpError(404, "no subscription found"); }
        await stripeClient.deleteCustomer(subscription.stripeId);
        await subscription.delete();
    }
}
