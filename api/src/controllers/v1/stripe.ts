import type { IStripeEvent, IOrder } from "jewl-core";
import { StripeEvent, StripeCompletedSession, validate, Stripe, StripePayment, Payment, PaymentState, Mail, MailState, MailType, StripeRefund, Refund, RefundState, OrderState, DateTime, Order, Allocation } from "jewl-core";
import { Body, Hidden, Post, Route, Security, SuccessResponse } from "tsoa";
import { HttpError } from "../../modules/error.js";
import { stripeClient } from "../../modules/network.js";

const handlers: Record<string, (data: object) => Promise<void>> = {
    handleCheckoutSessionCompleted: async (data: object): Promise<void> => {
        const body = await validate(StripeCompletedSession, data);
        const paymentMethod = await stripeClient.getPaymentMethod(body.customer);
        const stripe = new Stripe({
            userId: body.client_reference_id,
            customerId: body.customer,
            paymentId: paymentMethod.id,
            paymentType: paymentMethod.type
        });
        await stripe.save();
    },

    handlePaymentintentSucceeded: async (data: object): Promise<void> => {
        const body = await validate(StripePayment, data);
        const payment = await Payment.findOne({ stripeId: body.id });
        if (payment == null) { throw new HttpError(404, "payment could not be found"); }

        const allocations = await Allocation.findOne({ userId: payment.userId });
        if (allocations == null) { throw new HttpError(404, "allocation could not be found"); }

        if (body.latest_charge == null) { throw new HttpError(404, "charge could not be found"); }
        if (payment.state !== PaymentState.initiated) { throw new HttpError(403, "payment already registered"); }

        const charge = await stripeClient.retrieveCharge(body.latest_charge);
        payment.state = PaymentState.completed;
        payment.fee = charge.balance_transaction.fee.dividedBy(100);
        await payment.save();

        const orderAmount = payment.amount.minus(payment.fee);
        const feeAmount = orderAmount.multipliedBy(0.01);
        const orders: Array<IOrder> = [];
        for (const installment of [...Array(payment.installments).keys()]) {
            const installmentAmount = orderAmount.dividedBy(payment.installments);
            const installementFee = feeAmount.dividedBy(payment.installments);
            for (const allocationItem of allocations.allocation) {
                const order: IOrder = {
                    userId: payment.userId,
                    paymentId: payment.id as string,
                    state: OrderState.open,
                    notBefore: new DateTime().addingDays(installment * payment.period),
                    currency: allocationItem.currency,
                    amount: installmentAmount.dividedBy(allocationItem.percentage).decimalPlaces(2, 3),
                    fee: installementFee.dividedBy(allocationItem.percentage).decimalPlaces(2, 3),
                    destination: allocationItem.address
                };
                orders.push(order);
            }
        }

        await Order.insertMany(orders);
    },

    handlePaymentintentPaymentfailed: async (data: object): Promise<void> => {
        const body = await validate(StripePayment, data);
        const payment = await Payment.findOne({ stripeId: body.id });
        if (payment == null) { throw new HttpError(404, "payment could not be found"); }
        if (payment.state !== PaymentState.initiated) { throw new HttpError(403, "payment already registered"); }
        payment.state = PaymentState.failed;
        await payment.save();

        const mail = new Mail({
            userId: payment.userId,
            entityId: payment.id as string,
            state: MailState.pending,
            type: MailType.failed,
            data: { type: "payment", amount: payment.amount }
        });

        await mail.save();
    },

    handleRefundUpdated: async (data: object): Promise<void> => {
        const body = await validate(StripeRefund, data);
        if (body.status === "pending") { return; }
        const refund = await Refund.findOne({ stripeId: body.id });
        if (refund == null) { throw new HttpError(404, "refund could not be found"); }
        if (body.status === "succeeded" || body.status === "canceled") {
            refund.state = RefundState.completed;
        } else if (body.status === "requires_action" || body.status === "failed") {
            refund.state = RefundState.failed;

            const mail = new Mail({
                userId: refund.userId,
                entityId: refund.id as string,
                state: MailState.pending,
                type: MailType.failed,
                data: { type: "refund", amount: refund.amount }
            });

            await mail.save();
        }

        await refund.save();
    }

};

@Route("/v1/stripe")
@Hidden()
export class StripeController {
    @Post("/")
    @Security("stripe")
    @SuccessResponse("204")
    public async receivedStripeWebhook(@Body() body: IStripeEvent): Promise<void> {
        await validate(StripeEvent, body);
        const eventType = body.type
            .split(".")
            .map(x => x.charAt(0).toUpperCase() + x.slice(1))
            .join("")
            .replace(/[^A-Za-z]/ug, "");

        const handler = handlers[`handle${eventType}`];
        if (handler == null) { return; }
        await handler(body.data.object as object);
    }
}
