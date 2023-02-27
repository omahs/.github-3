import type { ISanctionReponse } from "jewl-core";
import { Sanction } from "jewl-core";
import { Route, Get, Path, Security, Controller, SuccessResponse, Response } from "tsoa";

/**
    A controller for looking up sanctionned addresses and transactions.
**/
@Route("/v1/sanction")
@Security("token")
@Security("key")
@Response<string>(401, "Unauthorized")
@Response<string>(429, "Too many requests")
export class SanctionController extends Controller {

    /**
        Returns a list of sanctions imposed on this addres. This endpoint does not look at
        the source of funds and is therefore not a replacement for AML compliance. No
        validation is done on whether the address or chain provided is valid or not. Address
        collisions across multiple chains are not taken into account.
    **/
    @Get("/{id}")
    @SuccessResponse(200, "Success")
    @Response<string>(400, "Bad request")
    public async getSanctionForAddress(@Path() id: string): Promise<ISanctionReponse> {
        const documents = await Sanction.find({ id });
        const sanctions = documents.map(x => x.sanction);
        return { sanctions };
    }
}
