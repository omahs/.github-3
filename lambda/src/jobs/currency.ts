import { PreciseNumber, Coin } from "jewl-core";
import { binanceClient } from "../modules/network.js";
import type { Document } from "mongoose";

export const getSupportedCurrencies = async (): Promise<void> => {
    const symbols = await binanceClient.getSymbols();
    const usdtTradingPairs = new Map<string, [PreciseNumber, boolean]>();
    for (const symbol of symbols.list) {
        if (symbol.symbol.startsWith("USDT")) {
            const coin = symbol.symbol.slice(4);
            const pair: [PreciseNumber, boolean] = [new PreciseNumber(1).dividedBy(symbol.price), false];
            usdtTradingPairs.set(coin, pair);
        } else if (symbol.symbol.endsWith("USDT")) {
            const coin = symbol.symbol.slice(0, -4);
            const pair: [PreciseNumber, boolean] = [symbol.price, true];
            usdtTradingPairs.set(coin, pair);
        }
    }

    const coins = await binanceClient.getCoins();
    const documents = new Map<string, Document>();
    for (const coin of coins.list) {
        const pair = usdtTradingPairs.get(coin.coin);
        if (pair == null) { continue; }
        for (const network of coin.networkList) {
            if (!network.depositEnable) { continue; }
            if (!network.withdrawEnable) { continue; }
            const name = coin.coin === network.network ? coin.name : `${coin.name} on ${network.name}`;

            const document = new Coin({
                name,
                coin: coin.coin,
                isBase: pair[1],
                isDefault: network.isDefault,
                requiresMemo: network.sameAddress,
                addressRegex: network.addressRegex,
                memoRegex: network.memoRegex,
                price: pair[0],
                fee: network.withdrawFee,
                min: network.withdrawMin,
                max: network.withdrawMax,
                multiple: network.withdrawIntegerMultiple,
                deliveryTime: network.estimatedArrivalTime
            });
            documents.set(name, document);
        }
    }

    await Coin.deleteMany();
    await Coin.insertMany(Array.from(documents.values()));
};
