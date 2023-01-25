import { DateTime, Payment, PaymentState, Stripe } from "jewl-core";
import { Types } from "mongoose";
import { stripeClient } from "../modules/network.js";

export const paymentJob = async (): Promise<void> => {
    const cursor = Payment.find({ state: PaymentState.scheduled, notBefore: { $lt: new DateTime() } }).cursor();
    for await (const payment of cursor) {
        const stripe = await Stripe.findOne({ userId: payment.userId });
        // Property stripe shouldn't be null at this point as removing should have cancelled all scheduled payments
        if (stripe == null) { continue; }

        payment.state = PaymentState.initiated;
        await payment.save();

        const charge = await stripeClient.createPayment(stripe.customerId, stripe.paymentId, payment.amount);

        payment.stripeId = charge.id;
        await payment.save();

        payment.notBefore = payment.notBefore.addingDays(payment.period * payment.installments);
        payment._id = new Types.ObjectId();
        payment.isNew = true;
        await payment.save();
    }
};
