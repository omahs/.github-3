import { DateTime, Payment, PaymentState, Mail, MailType, MailState } from "jewl-core";

export const announcePaymentJob = async (): Promise<void> => {
    const cursor = Payment.find({ state: PaymentState.scheduled, notBefore: { $lt: new DateTime().addingDays(-3), $gt: new DateTime() } }).cursor();
    for await (const payment of cursor) {
        const existingMail = await Mail.findOne({ entityId: payment.id as string, type: MailType.payment });
        if (existingMail != null) { continue; } // Mail already sent
        const mail = new Mail({
            userId: payment.userId,
            entityId: payment.id as string,
            state: MailState.pending,
            type: MailType.payment,
            data: { amount: payment.amount }
        });
        await mail.save();
    }
};
