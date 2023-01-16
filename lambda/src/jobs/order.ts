import { Order, Refund, RefundState, OrderState, PreciseNumber, Transfer, TransferState } from "jewl-core";
import type { ICoinbaseProduct, ICoinbaseAccount } from "jewl-core";
import { coinbaseClient, coinbasePublicClient, stripeClient } from "../modules/network.js";

const handleOrdersForUnsupportedCurrencies = async (_supportedCurrencies: Array<ICoinbaseProduct>): Promise<void> => {

    // TODO: <- refund those? change currency?

    return Promise.resolve();
};

const issueRefunds = async (): Promise<void> => {
    const cursor = Refund.find({ state: RefundState.pending }).cursor();
    for await (const refund of cursor) {
        const orders = await Order.find({ paymentId: refund.paymentId, state: OrderState.open });
        orders.forEach(x => { x.state = OrderState.closed; });
        await Order.bulkSave(orders);
        const amount = orders.reduce((x, y) => x.plus(y.amount), new PreciseNumber(0));
        refund.amount = amount;
        await refund.save();

        if (amount.eq(0)) {
            refund.state = RefundState.completed;
        } else {
            const stripeRefund = await stripeClient.postRefund(refund.paymentId, amount);
            refund.state = RefundState.initiated;
            refund.stripeId = stripeRefund.id;
        }

        await refund.save();
    }
};

const getAverageOrderPrice = async (product: ICoinbaseProduct, availableBalance: PreciseNumber): Promise<PreciseNumber> => {
    const orders = await coinbaseClient.getRecentOrders(product.id);

    let cumlative = new PreciseNumber(0);
    let equivalent = new PreciseNumber(0);
    let index = 0;

    while (cumlative.lt(availableBalance) && index < orders.length) {
        const order = orders[index];
        equivalent = equivalent.plus(product.base_currency === "EUR" ? order.filled_size : order.filled_size.div(order.price));
        cumlative = cumlative.plus(product.base_currency === "EUR" ? order.filled_size.div(order.price) : order.filled_size);
        index += 1;
    }

    const partialOrder = orders[index];
    const overflow = availableBalance.minus(cumlative);
    equivalent.minus(product.base_currency === "EUR" ? overflow.multipliedBy(partialOrder.price) : overflow.dividedBy(partialOrder.price));

    return equivalent.dividedBy(availableBalance);
};

const payoutCurrentOrder = async (product: ICoinbaseProduct, accounts: Array<ICoinbaseAccount>): Promise<void> => {
    await coinbaseClient.cancelOrders(product.id);
    const currency = product.base_currency === "EUR" ? product.quote_currency : product.base_currency;
    const availableBalance = accounts.find(x => x.currency === currency)?.available ?? new PreciseNumber(0);
    let averagePrice = await getAverageOrderPrice(product, availableBalance);
    const feeEstimate = await coinbaseClient.getTransferFee(currency);
    if (feeEstimate.fee.gt(1)) { return; } // TODO: <- is this in eur or in currency itself?

    const cursor = Order.find({ state: OrderState.open, currency }).sort({ created: -1 }).cursor();

    for await (const order of cursor) {
        if (availableBalance.lt(order.amount)) { break; }
        const transfer = new Transfer({
            userId: order.userId,
            orderId: order.id as string,
            state: TransferState.initiated,
            currency,
            amount: order.amount,
            price: averagePrice,
            destination: order.destination
        });
        await transfer.save();

        const withdrawal = await coinbaseClient.transfer(currency, order.amount, order.destination);
        transfer.coinbaseId = withdrawal.id;
        transfer.fee = withdrawal.fee; // TODO: <- is this in eur or in currency
        await transfer.save();

        averagePrice = averagePrice.minus(order.amount);
    }
};

const placeNewOrder = async (product: ICoinbaseProduct, accounts: Array<ICoinbaseAccount>): Promise<void> => {
    const currency = product.base_currency === "EUR" ? product.quote_currency : product.base_currency;
    const pendingOrders = await Order.find({ state: OrderState.open, currency });
    const pendingOrderSize = pendingOrders.reduce((x, y) => x.plus(y.amount), new PreciseNumber(0));
    const availableBalance = accounts.find(x => x.currency === currency)?.available ?? new PreciseNumber(0);
    const requiredOrderSize = pendingOrderSize.minus(availableBalance);
    const productBook = await coinbaseClient.getBook(product.id);
    const side = product.base_currency === "EUR" ? "sell" : "buy";
    const [[price]] = product.base_currency === "EUR" ? productBook.asks : productBook.bids;
    const size = product.base_currency === "EUR" ? requiredOrderSize : requiredOrderSize.div(price);
    await coinbaseClient.placeOrder(side, product.id, price, size);
};

export const orderAndRefundJob = async (): Promise<void> => {
    const products = await coinbasePublicClient.getProducts();
    await handleOrdersForUnsupportedCurrencies(products);

    const accountsBefore = await coinbaseClient.getAccounts();
    await Promise.all(products.map(async x => payoutCurrentOrder(x, accountsBefore)));

    await issueRefunds();

    const accountsAfter = await coinbaseClient.getAccounts();
    await Promise.all(products.map(async x => placeNewOrder(x, accountsAfter)));
};

