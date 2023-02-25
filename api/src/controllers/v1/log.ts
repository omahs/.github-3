import type { ILogResponse } from "jewl-core";
import { Get, Query, Route, Security } from "tsoa";

@Route("/v1/log")
@Security("token")
@Security("key")
export class LogController {

    /**
        Retrieves the past request to either `/v1/address` or `/v1/transaction`.
        Keep in mind that these responses are the exact results returned
        at that time. The results might no longer be accurate.
        This endpoint is paginated using cursor which is returned in the response.
    **/
    @Get("/")
    public async getLog(@Query() cursor?: string): Promise<ILogResponse> {
        const _ = cursor;
        return Promise.resolve({ next: 0 });
    }
}
