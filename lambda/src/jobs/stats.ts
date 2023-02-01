import { DateTime, Order, Payment, PaymentState, PreciseNumber, Statistic, Stripe, Transfer, TransferState, OrderState } from "jewl-core";

const userStat = async (): Promise<void> => {
    const numPaymentMethods = await Stripe.count();
    await Statistic.updateOne({ metric: "active investors" }, { value: numPaymentMethods }, { upsert: true });
};

const monthlyStat = async (): Promise<void> => {
    let cumlative = new PreciseNumber(0);
    const cutoffDate = new DateTime().addingDays(-31);
    const cursor = Payment.find({ state: PaymentState.completed, notBefore: { $lt: cutoffDate } }).cursor();
    for await (const payment of cursor) {
        cumlative = cumlative.plus(payment.amount);
    }
    await Statistic.updateOne({ metric: "monthly invested" }, { value: cumlative }, { upsert: true });
};

const transferStat = async (): Promise<void> => {
    const numTransfers = await Transfer.count({ state: TransferState.completed });
    await Statistic.updateOne({ metric: "crypto transactions" }, { value: numTransfers }, { upsert: true });
};

const orderStat = async (): Promise<void> => {
    const numOrders = await Order.count({ state: OrderState.open });
    await Statistic.updateOne({ metric: "open orders" }, { value: numOrders }, { upsert: true });
};

export const statsJob = async (): Promise<void> => {
    const promises = [
        userStat(),
        monthlyStat(),
        transferStat(),
        orderStat()
    ];
    await Promise.all(promises);
};
