import type { IPaymentSetupRequest, IPaymentSetupResponse, IPaymentResponse } from "jewl-core";
import { PaymentSetupRequest, Payment, PaymentState, getOrCreateUser, validate } from "jewl-core";
import { Delete, Get, Route, Security, Post, Body, Request, SuccessResponse } from "tsoa";
import type { WithAuthentication } from "../../modules/auth.js";
import { HttpError } from "../../modules/error.js";
import { authClient, stripeClient } from "../../modules/network.js";

@Route("/v1/payment")
@Security("token")
export class PaymentController {

    @Get("/")
    public async getPaymentMethod(@Request() req: WithAuthentication): Promise<IPaymentResponse> {
        const user = await getOrCreateUser(req.user.userId);
        const connected = user.stripeId != null;
        return { connected };
    }

    @Post("/")
    public async setupPaymentMethod(@Request() req: WithAuthentication, @Body() body: IPaymentSetupRequest): Promise<IPaymentSetupResponse> {
        await validate(PaymentSetupRequest, body);
        const authUser = await authClient.getUser(req.user.userId);
        if (!authUser.email_verified) { throw new HttpError(400, "email address not verified"); }
        const user = await getOrCreateUser(req.user.userId);
        if (user.stripeId != null) { throw new HttpError(400, "a payment method already exists"); }
        const redirect = await stripeClient.createSetupSession(body.callback, req.user.userId, authUser.email);
        return { redirect: redirect.url };
    }

    @Delete("/")
    @SuccessResponse(204)
    public async removePaymentMethod(@Request() req: WithAuthentication): Promise<void> {
        const user = await getOrCreateUser(req.user.userId);
        if (user.stripeId == null) { throw new HttpError(404, "no payment method found"); }
        await stripeClient.deleteCustomer(user.stripeId);
        user.stripeId = undefined;
        await user.save();
        await Payment.deleteMany({ userId: req.user.userId, state: PaymentState.scheduled });
    }

}
