import type { IPaymentRequest, IPaymentResponse } from "jewl-core";
import { PaymentState, Refund, RefundState, PaymentRequest, Payment, Order, OrderState, validate, Stripe, Allocation } from "jewl-core";
import { Delete, Get, Route, Security, Post, Body, Request, Put, SuccessResponse } from "tsoa";
import type { WithAuthentication } from "../../modules/auth.js";
import { HttpError } from "../../modules/error.js";
import { Types } from "mongoose";
import { stripeClient } from "../../modules/network.js";

@Route("/v1/payment")
@Security("token")
export class PaymentController {

    @Post("/")
    @SuccessResponse(204)
    public async initiatePayment(@Request() req: WithAuthentication, @Body() body: IPaymentRequest): Promise<void> {
        const validatedBody = await validate(PaymentRequest, body);

        const stripe = await Stripe.findOne({ userId: req.user.userId });
        if (stripe == null) { throw new HttpError(400, "no payment method set up"); }
        const allocation = await Allocation.findOne({ userId: req.user.userId });
        if (allocation == null) { throw new HttpError(400, "no allocation set up"); }

        const charge = await stripeClient.createPayment(stripe.customerId, stripe.paymentId, validatedBody.amount);

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
        const refund = new Refund({ userId: req.user.userId, paymentId: payment.id as string, state: RefundState.pending });
        await refund.save();
        await Payment.deleteMany({ userId: req.user.userId, state: PaymentState.scheduled });
    }

    @Get("/last")
    public async getLastPayment(@Request() req: WithAuthentication): Promise<IPaymentResponse> {
        const lastPayment = await Payment.findOne({ userId: req.user.userId }).sort({ notBefore: -1 });
        if (lastPayment == null) { throw new HttpError(404, "no payment found"); }
        const firstOrder = await Order.findOne({ userId: req.user.userId, state: OrderState.open });
        const hasOrders = firstOrder != null;
        const autoRenew = lastPayment.state === PaymentState.scheduled;
        return {
            amount: lastPayment.amount,
            installments: lastPayment.installments,
            period: lastPayment.period,
            autoRenew,
            isActive: hasOrders || autoRenew
        };
    }

    private async getAutoRenewStatus(req: WithAuthentication): Promise<boolean> {
        const scheduledPayment = await Payment.findOne({ userId: req.user.userId, state: PaymentState.scheduled });
        return scheduledPayment != null;
    }

    @Put("/renew")
    @SuccessResponse(204)
    public async enableAutoRenew(@Request() req: WithAuthentication): Promise<void> {
        const autoRenewStatus = await this.getAutoRenewStatus(req);
        if (autoRenewStatus) { throw new HttpError(400, "auto-renew already enabled"); }
        const stripe = await Stripe.findOne({ userId: req.user.userId });
        if (stripe == null) { throw new HttpError(400, "no payment method set up"); }
        const allocation = await Allocation.findOne({ userId: req.user.userId });
        if (allocation == null) { throw new HttpError(400, "no allocation set up"); }
        const payment = await Payment.findOne({ userId: req.user.userId }).sort({ notBefore: -1 });
        if (payment == null) { throw new HttpError(400, "no payment to auto-renew"); }
        payment.notBefore = payment.notBefore.addingDays(payment.period * payment.installments);
        payment.state = PaymentState.scheduled;
        payment._id = new Types.ObjectId();
        payment.isNew = true;
        await payment.save();
    }

    @Delete("/renew")
    @SuccessResponse(204)
    public async cancelAuthRenew(@Request() req: WithAuthentication): Promise<void> {
        const autoRenewStatus = await this.getAutoRenewStatus(req);
        if (!autoRenewStatus) { throw new HttpError(400, "auto-renew not enabled"); }
        await Payment.deleteMany({ userId: req.user.userId, state: PaymentState.scheduled });
    }

}
