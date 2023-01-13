import type { IPaymentSetupRequest, IPaymentSetupResponse, IPaymentResponse } from "jewl-core";
import { PaymentMethod, PaymentSetupRequest } from "jewl-core";
import { Delete, Get, Route, Security, Post, Body, Request, SuccessResponse } from "tsoa";
import type { WithAuthentication } from "../../modules/auth.js";
import { HttpError } from "../../modules/error.js";
import { stripeClient } from "../../modules/network.js";

@Route("/v1/payment")
@Security("token")
export class PaymentController {

    @Get("/")
    public async getPaymentMethod(@Request() req: WithAuthentication): Promise<IPaymentResponse> {
        const method = await PaymentMethod.findOne({ userId: req.user.userId });
        const connected = method != null;
        return { connected };
    }

    @Post("/")
    public async setupPaymentMethod(@Request() req: WithAuthentication, @Body() body: IPaymentSetupRequest): Promise<IPaymentSetupResponse> {
        const validatedBody = new PaymentSetupRequest(body);
        const method = await PaymentMethod.findOne({ userId: req.user.userId });
        if (method != null) { throw new HttpError(400, "a payment method already exists"); }
        const redirect = await stripeClient.createSetupSession(validatedBody.callback, req.user.userId);
        return { redirect };
    }

    @Delete("/")
    @SuccessResponse(204)
    public async removePaymentMethod(@Request() req: WithAuthentication): Promise<void> {
        const method = await PaymentMethod.findOne({ userId: req.user.userId });
        if (method == null) { throw new HttpError(404, "no payment method found"); }
        await stripeClient.detatchPaymentMethod(method.stripeId);
        await method.delete();
    }

}
