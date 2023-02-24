import { Get, Route } from "tsoa";
import type { IPingResponse, IStatusResponse } from "jewl-core";
import { getServerStatus } from "../../modules/security.js";

@Route("/v1")
export class PublicController {

    @Get("/ping")
    public getMessage(): IPingResponse {
        return { message: "pong" };
    }

    @Get("/status")
    public async getStatus(): Promise<IStatusResponse> {
        const status = await getServerStatus();
        return { status };
    }
}
