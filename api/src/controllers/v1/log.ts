import type { ILogsResponse } from "jewl-core";
import { DateTime, Log } from "jewl-core";
import { Controller, Get, Query, Route, Security, SuccessResponse, Response, Request } from "tsoa";
import type { WithAuthentication } from "../../modules/auth.js";

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
        at that time. The results might no longer be accurate. This endpoint
        is paginated using a cursor which is returned in the response.
    **/
    @Get("/")
    @SuccessResponse(200, "Success")
    public async getLog(@Request() req: WithAuthentication, @Query() cursor?: string): Promise<ILogsResponse> {
        const start = new DateTime(cursor);
        const query = {
            userId: req.user.userId,
            timestamp: { $lt: start }
        };
        const logs = await Log.find(query).sort({ timestamp: -1 }).limit(50);
        if (logs.length === 0) { return { next: start, items: [] }; }
        const next = logs[logs.length - 1].timestamp;
        const items = logs.map(x => {
            return {
                endpoint: x.endpoint,
                status: x.status,
                response: x.response,
                timestamp: x.timestamp,
                credits: x.credits
            };
        });

        return { next, items };
    }
}
