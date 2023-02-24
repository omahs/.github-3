import { Body, Post, Route, Security } from "tsoa";
import type { IEstimateRequest, IEstimateResponse } from "jewl-core";
import { Currency, EstimateRequest, Estimator, Price } from "jewl-core";
import { validateBody } from "../../modules/mongo.js";

@Route("/v1/swap")
@Security("")
export class SwapController {

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
