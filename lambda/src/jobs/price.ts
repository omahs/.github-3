import { PreciseNumber, Price } from "jewl-core";
import { binanceClient } from "../modules/network.js";
import type { Document } from "mongoose";

export const getCurrencyPrices = async (): Promise<void> => {
    const symbols = await binanceClient.getSymbols();
    const prices = new Map<string, Document>([
        ["USDT", new Price({ coin: "USDT", isBase: true, price: new PreciseNumber(1) })]
    ]);
    for (const symbol of symbols.list) {
        if (symbol.symbol.startsWith("USDT")) {
            const coin = symbol.symbol.slice(4);
            const price = new Price({ coin, isBase: false, price: new PreciseNumber(1).dividedBy(symbol.price) });
            prices.set(coin, price);
        } else if (symbol.symbol.endsWith("USDT")) {
            const coin = symbol.symbol.slice(0, -4);
            const price = new Price({ coin, isBase: true, price: symbol.price });
            prices.set(coin, price);
        }
    }

    await Price.deleteMany();
    await Price.insertMany(Array.from(prices.values()));
};
