import type { IInitiateOrderRequest, IOrderRenewResponse } from "jewl-core";
import { PaymentState, Refund, RefundState, InitiateOrderRequest, Payment, Order, OrderState, getOrCreateUser } from "jewl-core";
import { Delete, Get, Route, Security, Post, Body, Request, Put, SuccessResponse } from "tsoa";
import type { WithAuthentication } from "../../modules/auth.js";
import { HttpError } from "../../modules/error.js";
import { Types } from "mongoose";
import { stripeClient } from "../../modules/network.js";

@Route("/v1/order")
@Security("token")
export class OrderController {

    @Get("/")
    public getAllOrders(): void {
        // TODO: \/
        console.log("A");
    }

    @Post("/")
    @SuccessResponse(204)
    public async initiateOrder(@Request() req: WithAuthentication, @Body() body: IInitiateOrderRequest): Promise<void> {
        const validatedBody = new InitiateOrderRequest(body);

        const user = await getOrCreateUser(req.user.userId);
        if (user.stripeId == null) { throw new HttpError(400, "no payment method set up"); }
        if (Object.keys(user.allocation).length === 0) { throw new HttpError(400, "no allocation set up"); }

        const charge = await stripeClient.createCharge(user.stripeId, validatedBody.amount);

        const payment = new Payment({
            userId: req.user.userId,
            stripeId: charge.id,
            state: PaymentState.initiated,
            amount: validatedBody.amount,
            installments: validatedBody.installments,
            period: validatedBody.period
        });

        await payment.save();

        if (validatedBody.autoRenew) { await this.enableAutoRenew(req); }
    }

    @Delete("/")
    @SuccessResponse(204)
    public async cancelPendingOrders(@Request() req: WithAuthentication): Promise<void> {
        const payment = await Payment.findOne({ userId: req.user.userId, state: PaymentState.completed }).sort({ notBefore: -1 });
        if (payment == null) { throw new HttpError(400, "no payment to refund"); }
        const existingRefund = await Refund.findOne({ paymentId: payment.id as string });
        if (existingRefund != null) { throw new HttpError(400, "refund already found for this payment"); }
        const orders = await Order.find({ paymentId: payment.id as string, state: OrderState.open });
        if (orders.length === 0) { throw new HttpError(400, "nothing to refund"); }
        const refund = new Refund({ paymentId: payment.stripeId, state: RefundState.pending });
        await refund.save();
        await Payment.deleteMany({ userId: req.user.userId, state: PaymentState.scheduled });
    }

    @Get("/renew")
    public async getAutoRenewStatus(@Request() req: WithAuthentication): Promise<IOrderRenewResponse> {
        const scheduledPayment = await Payment.findOne({ userId: req.user.userId, state: PaymentState.scheduled });
        const autoRenewEnabled = scheduledPayment != null;
        return { enabled: autoRenewEnabled };
    }

    @Put("/renew")
    @SuccessResponse(204)
    public async enableAutoRenew(@Request() req: WithAuthentication): Promise<void> {
        const status = await this.getAutoRenewStatus(req);
        if (status.enabled) { throw new HttpError(400, "auto-renew already enabled"); }
        const user = await getOrCreateUser(req.user.userId);
        if (user.stripeId == null) { throw new HttpError(400, "no payment method set up"); }
        if (Object.keys(user.allocation).length === 0) { throw new HttpError(400, "no allocation set up"); }
        const payment = await Payment.findOne({ userId: req.user.userId, state: PaymentState.completed }).sort({ notBefore: -1 });
        if (payment == null) { throw new HttpError(400, "no payment to auto-renew"); }
        payment.notBefore = payment.notBefore.addingDays(payment.period * payment.installments);
        payment._id = new Types.ObjectId();
        payment.isNew = true;
        await payment.save();
    }

    @Delete("/renew")
    @SuccessResponse(204)
    public async cancelAuthRenew(@Request() req: WithAuthentication): Promise<void> {
        const status = await this.getAutoRenewStatus(req);
        if (!status.enabled) { throw new HttpError(400, "auto-renew not enabled"); }
        await Payment.deleteMany({ userId: req.user.userId, state: PaymentState.scheduled });
    }
}
