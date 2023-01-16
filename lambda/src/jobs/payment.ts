import { DateTime, Payment, PaymentState, getOrCreateUser } from "jewl-core";
import { Types } from "mongoose";
import { stripeClient } from "../modules/network.js";

export const paymentJob = async (): Promise<void> => {
    const cursor = Payment.find({ state: PaymentState.scheduled, notBefore: { $lt: new DateTime() } }).cursor();
    for await (const payment of cursor) {
        const user = await getOrCreateUser(payment.userId);
        // Property stripeId shouldn't be null at this point as removing should have cancelled all scheduled payments
        if (user.stripeId == null) { continue; }

        payment.state = PaymentState.initiated;
        await payment.save();

        const charge = await stripeClient.createCharge(user.stripeId, payment.amount);

        payment.stripeId = charge.id;
        await payment.save();

        payment.notBefore = payment.notBefore.addingDays(payment.period * payment.installments);
        payment._id = new Types.ObjectId();
        payment.isNew = true;
        await payment.save();
    }
};
