import type { IRiskResponse } from "jewl-core";
import { Route, Get, Path, Security, SuccessResponse, Response } from "tsoa";
import { SanctionController } from "./sanction.js";

/**
    A controller for creating risk profiles.
**/
@Route("/v1/risk")
@Security("token", ["metered"])
@Security("key", ["metered"])
@Response<string>(401, "Unauthorized")
@Response<string>(429, "Too many requests")
export class RiskController extends SanctionController {

    /**
        Get the risk profile for an address. This method returns the source of funds for
        all the assets currently in the address's wallet. The address is also checked against sanction
        lists. No validation is done on whether the address provided
        is valid or not.

        Each call to this endpoint uses 1 credit.
    **/
    @Get("/address/{chain}/{id}")
    @SuccessResponse(200, "Success")
    public async getRiskProfileForAddress(@Path() chain: string, @Path() id: string): Promise<IRiskResponse> {
        const sanctions = await this.getSanctionForAddress(id);
        // TODO: AI Model to estimate source of funds.
        return { risk: 0, source: [], ...sanctions };
    }

    /**
        Get the risk profile for a transaction. This method returns the source of funds for
        all the funds included in the transaction. The address is also checked against sanction
        lists. No validation is done on whether the address provided
        is valid or not.

        Each call to this endpoint uses 1 credit.
    **/
    @Get("/transaction/{chain}/{id}")
    @SuccessResponse(200, "Success")
    public async getRiskProfileForTransaction(@Path() chain: string, @Path() id: string): Promise<IRiskResponse> {
        const address = id; // TODO: get address that initiated the transaction
        return this.getRiskProfileForAddress(chain, address);
    }
}
