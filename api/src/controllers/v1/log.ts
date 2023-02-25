import type { ILogsResponse } from "jewl-core";
import { Controller, Get, Query, Route, Security, SuccessResponse, Response } from "tsoa";

/**
    A controller for returning a log trail of all the requests made by a
    specific user.
**/
@Route("/v1/log")
@Security("token")
@Security("key")
@Response<string>(401, "Unauthorized")
@Response<string>(429, "Too many requests")
export class LogController extends Controller {

    /**
        Retrieves the past request to either `/v1/address` or `/v1/transaction`.
        Keep in mind that these responses are the exact results returned
        at that time. The results might no longer be accurate.
        This endpoint is paginated using cursor which is returned in the response.
    **/
    @Get("/")
    @SuccessResponse(200, "Success")
    // @Response<string>(401, "Unauthorized")
    public async getLog(@Query() cursor?: string): Promise<ILogsResponse> {
        const _ = cursor;
        return Promise.resolve({ next: 0, items: [] });
    }
}
