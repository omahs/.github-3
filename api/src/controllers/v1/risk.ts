import type { IRiskResponse } from "jewl-core";
import { Route, Get, Path, Security, Controller, SuccessResponse, Response } from "tsoa";

/**
    A controller for creating risk profiles.
**/
@Route("/v1")
@Security("token")
@Security("key")
@Response<string>(401, "Unauthorized")
@Response<string>(429, "Too many requests")
export class RiskController extends Controller {

    /**
        Get the risk profile for an address. This method returns the source of funds for
        all the funds currently in the address's wallet.
    **/
    @Get("/address/{id}")
    @SuccessResponse(200, "Success")
    public async getRiskProfileForAddress(@Path() id: string): Promise<IRiskResponse> {
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
    @SuccessResponse(200, "Success")
    public async getRiskProfileForTransaction(@Path() id: string): Promise<IRiskResponse> {
        const _ = id;
        return Promise.resolve({
            risk: 0,
            source: []
        });
    }
}
