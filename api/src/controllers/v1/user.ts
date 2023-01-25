import type { IPaymentMethodSetupRequest, IPaymentMethodResponse, IPaymentMethodSetupResponse, IPingResponse } from "jewl-core";
import { Stripe } from "jewl-core";
import { PaymentMethodSetupRequest, Payment, PaymentState, validate } from "jewl-core";
import { Delete, Get, Route, Security, Post, Body, Request, SuccessResponse } from "tsoa";
import type { WithAuthentication } from "../../modules/auth.js";
import { HttpError } from "../../modules/error.js";
import { authClient, stripeClient } from "../../modules/network.js";

@Route("/v1/user")
@Security("token")
export class UserController {
    @Get("/")
    public getMessage(): IPingResponse {
        return { message: "user" };
    }

    // TODO: set allocations and addresses

    @Get("/payment")
    public async getPaymentMethod(@Request() req: WithAuthentication): Promise<IPaymentMethodResponse> {
        const stripe = await Stripe.findOne({ userId: req.user.userId });
        const connected = stripe != null;
        return { connected };
    }

    @Post("/payment")
    public async setupPaymentMethod(@Request() req: WithAuthentication, @Body() body: IPaymentMethodSetupRequest): Promise<IPaymentMethodSetupResponse> {
        const validatedBody = await validate(PaymentMethodSetupRequest, body);
        const authUser = await authClient.getUser(req.user.userId);
        if (!authUser.email_verified) { throw new HttpError(400, "email address not verified"); }
        const stripe = await Stripe.findOne({ userId: req.user.userId });
        if (stripe != null) { throw new HttpError(400, "a payment method already exists"); }
        const redirect = await stripeClient.createSetupSession(validatedBody.callback, req.user.userId, authUser.email);
        return { redirect: redirect.url };
    }

    @Delete("/payment")
    @SuccessResponse(204)
    public async removePaymentMethod(@Request() req: WithAuthentication): Promise<void> {
        const stripe = await Stripe.findOneAndDelete({ userId: req.user.userId });
        if (stripe == null) { throw new HttpError(404, "no payment method found"); }
        await stripeClient.deleteCustomer(stripe.customerId);
        await Payment.deleteMany({ userId: req.user.userId, state: PaymentState.scheduled });
    }
}
