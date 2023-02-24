import type { ILogResponse } from "jewl-core";
import { Get, Query, Route, Security } from "tsoa";

@Route("/v1/log")
@Security("token")
@Security("key")
export class LogController {

    @Get("/")
    public async getMessage(@Query() cursor: string): Promise<ILogResponse> {
        const _ = cursor;
        return Promise.resolve({ next: 0 });
    }
}
