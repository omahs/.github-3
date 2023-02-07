import { Get, Route } from "tsoa";
import type { IPingResponse, IStatusResponse } from "jewl-core";
import { ServerStatus } from "jewl-core";

@Route("/v1")
export class PublicController {
    @Get("/ping")
    public getMessage(): IPingResponse {
        return { message: "pong" };
    }

    @Get("/status")
    public getStatus(): IStatusResponse {
        const isMaintainance = process.env.MAINTAINANCE === "true";
        return {
            status: isMaintainance ? ServerStatus.maintainance : ServerStatus.normal
        };
    }
}
