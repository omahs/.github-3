import { Body, Get, Post, Route, Security } from "tsoa";
import type { ICurrencyResponse, IEstimateRequest, IEstimateResponse } from "jewl-core";
import { Currency, EstimateRequest, Estimator, Price } from "jewl-core";
import { validateBody } from "../../modules/mongo.js";

@Route("/v1/swap")
@Security("")
export class SwapController {
    @Get("/currency/all")
    public async getCurrencies(): Promise<ICurrencyResponse> {
        const currencies = await Currency.find().sort({ name: 1 });
        const response = currencies.map(x => {
            return {
                name: x.name,
                coin: x.coin,
                network: x.network,
                networkName: x.networkName,
                isDefault: x.isDefault,
                requiresMemo: x.requiresMemo,
                addressRegex: x.addressRegex,
                memoRegex: x.memoRegex,
                min: x.min,
                max: x.max,
                multiple: x.multiple
            };
        });
        return { currencies: response };
    }

    @Post("/estimate")
    public async getEsimate(@Body() body: IEstimateRequest): Promise<IEstimateResponse> {
        const validatedBody = await validateBody(EstimateRequest, body);
        const names = validatedBody.output.map(x => x.coin).concat([body.input.coin]);
        const currencies = await Currency.find({ coin: { $in: names } });
        const prices = await Price.find({ coin: { $in: names } });
        const graph = new Estimator(validatedBody, currencies, prices);
        return graph.estimate();
    }
}
