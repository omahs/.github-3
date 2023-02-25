import { Body, Delete, Get, Hidden, Post, Route, Security, Request, SuccessResponse } from "tsoa";
import type { IPaymentMethodResponse, IPaymentMethodSetupRequest, IPaymentMethodSetupResponse } from "jewl-core";
import { PaymentMethod, PaymentMethodSetupRequest } from "jewl-core";
import { HttpError } from "../../modules/error.js";
import { validateBody } from "../../modules/mongo.js";
import type { WithAuthentication } from "../../modules/auth.js";
import { authClient, stripeClient } from "../../modules/network.js";

@Route("/v1/payment")
@Security("token")
@Hidden()
export class PaymentController {

    /**
        Get the currently logged in user's connected payment method.
    **/
    @Get("/")
    public async getPaymentMethod(@Request() req: WithAuthentication): Promise<IPaymentMethodResponse> {
        const stripe = await PaymentMethod.findOne({ userId: req.user.userId });
        if (stripe == null) { throw new HttpError(404, "no payment method found"); }
        return {
            type: stripe.type,
            subtype: stripe.subtype,
            last4: stripe.last4
        };
    }

    /**
        Get an url for setting up a stripe payment method.
    **/
    @Post("/")
    public async setupPaymentMethod(@Request() req: WithAuthentication, @Body() body: IPaymentMethodSetupRequest): Promise<IPaymentMethodSetupResponse> {
        const validatedBody = await validateBody(PaymentMethodSetupRequest, body);
        const authUser = await authClient.getUser(req.user.userId);
        if (!authUser.email_verified) { throw new HttpError(400, "email address not verified"); }
        const stripe = await PaymentMethod.findOne({ userId: req.user.userId });
        if (stripe != null) { throw new HttpError(400, "a payment method already exists"); }
        const redirect = await stripeClient.createSetupSession(validatedBody.callback, req.user.userId, authUser.email);
        return { redirect: redirect.url };
    }

    /**
        Delete the currently logged in user's payment method.
    **/
    @Delete("/")
    @SuccessResponse(204)
    public async deletePaymentMethod(@Request() req: WithAuthentication): Promise<void> {
        const stripe = await PaymentMethod.findOneAndDelete({ userId: req.user.userId });
        if (stripe == null) { throw new HttpError(404, "no payment method found"); }
        await stripeClient.deleteCustomer(stripe.customerId);
    }
}
