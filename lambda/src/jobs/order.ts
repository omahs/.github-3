import { Order, Refund, RefundState, OrderState, PreciseNumber } from "jewl-core";
import type { ICoinbaseProduct, ICoinbaseAccount } from "jewl-core";
import { coinbaseClient, coinbasePublicClient, stripeClient } from "../modules/network.js";

const handleOrdersForUnsupportedCurrencies = async (_supportedCurrencies: Array<ICoinbaseProduct>): Promise<void> => {

    // TODO: <- refund those? change currency

    return Promise.resolve();
};

const issueRefunds = async (): Promise<void> => {
    const cursor = Refund.find({ state: RefundState.pending }).cursor();
    const promises: Array<Promise<void>> = [];
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
    await Promise.all(promises);
};

const payoutCurrentOrder = async (product: ICoinbaseProduct, accounts: Array<ICoinbaseAccount>): Promise<void> => {
    const currency = product.base_currency === "EUR" ? product.quote_currency : product.base_currency;
    await coinbaseClient.cancelOrders(product.id);
    const orders = await coinbaseClient.getRecentOrders(product.id);
    const availableBalance = accounts.find(x => x.currency === currency)?.available ?? new PreciseNumber(0);
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

    const _averagePrice = equivalent.dividedBy(availableBalance);

    // TODO: \/
    // Save transfer with average price

    // Initiate coinbase transfer

    // Save the transaction id (and explorer url)
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

export const orderCronJob = async (): Promise<void> => {
    const products = await coinbasePublicClient.getProducts();
    await handleOrdersForUnsupportedCurrencies(products);

    const accountsBefore = await coinbaseClient.getAccounts();
    await Promise.all(products.map(async x => payoutCurrentOrder(x, accountsBefore)));

    await issueRefunds();

    const accountsAfter = await coinbaseClient.getAccounts();
    await Promise.all(products.map(async x => placeNewOrder(x, accountsAfter)));
};

