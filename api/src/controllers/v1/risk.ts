import type { IRiskResponse } from "jewl-core";
import { Route, Get, Path, Security } from "tsoa";

@Route("/v1")
@Security("token")
@Security("key")
export class RiskController {

    /**
        Get the risk profile for an address. This method returns the source of funds for
        all the funds currently in the address's wallet.
    **/
    @Get("/address/{id}")
    public async getRiskProfileByAddress(@Path() id: string): Promise<IRiskResponse> {
        const _ = id;
        return Promise.resolve({
            risk: 0,
            source: []
        });
    }

    /**
        Get the risk profile for a transaction. This method returns the source of funds for
        all the funds included in the transaction. The address is also checked against sanction
        lists.
    **/
    @Get("/transaction/{id}")
    public async getStatus(@Path() id: string): Promise<IRiskResponse> {
        const _ = id;
        return Promise.resolve({
            risk: 0,
            source: []
        });
    }
}
