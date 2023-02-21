import { Currency } from "jewl-core";
import { binanceClient } from "../modules/network.js";
import type { Document } from "mongoose";

export const getSupportedCurrencies = async (): Promise<void> => {
    const coins = await binanceClient.getCoins();
    const currencies: Array<Document> = [];
    for (const coin of coins.list) {
        if (coin.isLegalMoney) { continue; }
        for (const network of coin.networkList) {
            if (!network.depositEnable) { continue; }
            if (!network.withdrawEnable) { continue; }

            const currency = new Currency({
                coin: coin.coin,
                name: coin.name,
                network: network.network,
                networkName: network.name,
                isDefault: network.isDefault,
                requiresMemo: network.sameAddress,
                addressRegex: network.addressRegex,
                memoRegex: network.memoRegex,
                fee: network.withdrawFee,
                min: network.withdrawMin,
                max: network.withdrawMax,
                multiple: network.withdrawIntegerMultiple,
                deliveryTime: network.estimatedArrivalTime
            });
            currencies.push(currency);
        }
    }

    await Currency.deleteMany();
    await Currency.insertMany(currencies);
};
