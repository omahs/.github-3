import type { ICurrency, IPrice } from "../entities/entities.js";
import type { IEstimateRequest, IEstimateResponse, IEstimateResponseItem } from "../entities/swap.js";
import { PreciseNumber } from "./number.js";

export class Estimator {
    private readonly request: IEstimateRequest;
    private readonly currencyMap = new Map<string, ICurrency>();
    private readonly priceMap = new Map<string, IPrice>();

    public constructor(request: IEstimateRequest, currencies: Array<ICurrency>, prices: Array<IPrice>) {
        this.request = request;

        for (const currency of currencies) {
            this.currencyMap.set(currency.coin + currency.network, currency);
            if (currency.isDefault) {
                this.currencyMap.set(currency.coin, currency);
            }
        }

        for (const price of prices) {
            this.priceMap.set(price.coin, price);
        }
    }


    private currency(coin: string, network?: string): ICurrency {
        const key = network == null ? coin : coin + network;
        const currency = this.currencyMap.get(key);
        if (currency == null) { throw new Error(`currency ${key} not found`); }
        return currency;
    }

    private price(coin: string): IPrice {
        const price = this.priceMap.get(coin);
        if (price == null) { throw new Error(`price for ${coin} not found`); }
        return price;
    }

    public estimate(): IEstimateResponse {
        const estimateOutput = this.request.input.amount != null;
        return estimateOutput
            ? this.getOutputEstimate()
            : this.getInputEstimate();
    }

    private getOutputEstimate(): IEstimateResponse {
        const input = this.request.input;
        const inputCoin = this.currency(input.coin, input.network);
        const inputPrice = this.price(input.coin).price;
        const inputAmount = input.amount ?? new PreciseNumber(0);
        const inputResponse: IEstimateResponseItem = {
            coin: inputCoin.coin,
            network: inputCoin.network,
            amount: inputAmount,
            usdEquivalent: inputAmount.multipliedBy(inputPrice)
        };

        const usd = inputAmount.multipliedBy(inputPrice).multipliedBy(0.99);

        const outputResponse: Array<IEstimateResponseItem> = [];
        let outputDeliveryTime = 0;
        for (const output of this.request.output) {
            const outputCoin = this.currency(output.coin, output.network);
            const outputPercentage = output.percentage ?? new PreciseNumber(0);
            const outputPrice = this.price(output.coin).price;
            const outputAmount = usd.multipliedBy(outputPercentage).dividedBy(outputPrice).minus(outputCoin.fee);
            outputDeliveryTime = Math.max(outputCoin?.deliveryTime ?? 0);
            outputResponse.push({
                coin: outputCoin.coin,
                network: outputCoin.network,
                amount: outputAmount,
                usdEquivalent: outputAmount.multipliedBy(outputPrice)
            });
        }

        const outputUsd = outputResponse.reduce((prev, current) => prev.plus(current.usdEquivalent), new PreciseNumber(0));
        return {
            input: inputResponse,
            output: outputResponse,
            fee: inputResponse.usdEquivalent.minus(outputUsd),
            deliveryTime: outputDeliveryTime + (inputCoin?.deliveryTime ?? 0)
        };
    }

    private getInputEstimate(): IEstimateResponse {
        let usd = new PreciseNumber(0);
        let outputDeliveryTime = 0;
        const outputResponse: Array<IEstimateResponseItem> = [];
        for (const output of this.request.output) {
            const outputCoin = this.currency(output.coin, output.network);
            const outputAmount = output.amount ?? new PreciseNumber(0);
            const outputPrice = this.price(output.coin).price;
            const outputUsd = outputAmount.plus(outputCoin.fee).multipliedBy(outputPrice);
            usd = usd.plus(outputUsd);
            outputDeliveryTime = Math.max(outputCoin?.deliveryTime ?? 0);
            outputResponse.push({
                coin: outputCoin.coin,
                network: outputCoin.network,
                amount: outputAmount,
                usdEquivalent: outputAmount.multipliedBy(outputPrice)
            });
        }
        usd = usd.dividedBy(0.99);

        const input = this.request.input;
        const inputCoin = this.currency(input.coin, input.network);
        const inputPrice = this.price(input.coin).price;
        const inputResponse: IEstimateResponseItem = {
            coin: inputCoin.coin,
            network: inputCoin.network,
            amount: usd.dividedBy(inputPrice),
            usdEquivalent: usd
        };
        const outputUsd = outputResponse.reduce((prev, current) => prev.plus(current.usdEquivalent), new PreciseNumber(0));
        return {
            input: inputResponse,
            output: outputResponse,
            fee: inputResponse.usdEquivalent.minus(outputUsd),
            deliveryTime: outputDeliveryTime + (inputCoin?.deliveryTime ?? 0)
        };
    }

}
