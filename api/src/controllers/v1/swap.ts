import { Body, Get, Post, Route, Security } from "tsoa";
import type { ICoin, ICurrencyResponse, ICurrencyResponseItem, IEstimateRequest, IEstimateResponse, IEstimateResponseItem } from "jewl-core";
import { Coin, PreciseNumber, EstimateRequest } from "jewl-core";
import { validateBody } from "../../modules/mongo.js";

@Route("/v1/swap")
@Security("")
export class SwapController {
    @Get("/currency/all")
    public async getCurrencies(): Promise<ICurrencyResponse> {
        const coins = await Coin.find();
        const currencies: Record<string, ICurrencyResponseItem> = { };
        coins.forEach(x => {
            currencies[x.name] = {
                coin: x.coin,
                requiresMemo: x.requiresMemo,
                addressRegex: x.addressRegex,
                memoRegex: x.memoRegex,
                min: x.min,
                max: x.max,
                multiple: x.multiple
            };
        });
        return {
            currencies
        };
    }

    @Post("/estimate")
    public async getEsimate(@Body() body: IEstimateRequest): Promise<IEstimateResponse> {
        const validatedBody = await validateBody(EstimateRequest, body);
        const names = validatedBody.output.map(x => x.currency).concat([validatedBody.input.currency]);
        const coins = await Coin.find({ name: { $in: names } });
        const currencies = new Map<string, ICoin>();
        coins.forEach(x => currencies.set(x.name, x));
        const estimateOutput = validatedBody.input.amount != null;
        return estimateOutput
            ? this.getOutputEstimate(validatedBody, currencies)
            : this.getInputEstimate(validatedBody, currencies);
    }

    private getInputEstimate(body: IEstimateRequest, coins: Map<string, ICoin>): IEstimateResponse {
        let usd = new PreciseNumber(0);
        let outputDeliveryTime = 0;
        const outputResponse: Array<IEstimateResponseItem> = [];
        for (const output of body.output) {
            const outputCoin = coins.get(output.currency);
            const outputAmount = output.amount ?? new PreciseNumber(0);
            const outputFee = outputCoin?.fee ?? new PreciseNumber(0);
            const outputPrice = outputCoin?.price ?? new PreciseNumber(0);
            const outputUsd = outputAmount.plus(outputFee).multipliedBy(outputPrice);
            usd = usd.plus(outputUsd);
            outputDeliveryTime = Math.max(outputCoin?.deliveryTime ?? 0);
            outputResponse.push({
                currency: output.currency,
                amount: outputAmount,
                usdEquivalent: outputAmount.multipliedBy(outputPrice)
            });
        }
        usd = usd.dividedBy(0.99);

        const inputCoin = coins.get(body.input.currency);
        const inputPrice = inputCoin?.price ?? new PreciseNumber(0);
        const inputResponse: IEstimateResponseItem = {
            currency: body.input.currency,
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

    private getOutputEstimate(body: IEstimateRequest, coins: Map<string, ICoin>): IEstimateResponse {
        const inputCoin = coins.get(body.input.currency);
        const inputPrice = inputCoin?.price ?? new PreciseNumber(0);
        const inputAmount = body.input.amount ?? new PreciseNumber(0);
        const inputResponse: IEstimateResponseItem = {
            currency: body.input.currency,
            amount: inputAmount,
            usdEquivalent: inputAmount.multipliedBy(inputPrice)
        };

        const usd = inputAmount.multipliedBy(inputPrice).multipliedBy(0.99);

        const outputResponse: Array<IEstimateResponseItem> = [];
        let outputDeliveryTime = 0;
        for (const output of body.output) {
            const outputCoin = coins.get(output.currency);
            const outputPercentage = output.percentage ?? new PreciseNumber(0);
            const outputFee = outputCoin?.fee ?? new PreciseNumber(0);
            const outputPrice = outputCoin?.price ?? new PreciseNumber(0);
            const outputAmount = usd.multipliedBy(outputPercentage).dividedBy(outputPrice).minus(outputFee);
            outputDeliveryTime = Math.max(outputCoin?.deliveryTime ?? 0);
            outputResponse.push({
                currency: output.currency,
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
}
