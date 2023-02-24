import type { IRiskResponse } from "jewl-core";
import { Route, Get, Path, Security } from "tsoa";

@Route("/v1")
@Security("token")
@Security("key")
export class RiskController {
    @Get("/address/{id}")
    public async getRiskProfileByAddress(@Path() id: string): Promise<IRiskResponse> {
        const _ = id;
        return Promise.resolve({
            risk: 0,
            source: []
        });
    }

    @Get("/transaction/{id}")
    public async getStatus(@Path() id: string): Promise<IRiskResponse> {
        const _ = id;
        return Promise.resolve({
            risk: 0,
            source: []
        });
    }
}
