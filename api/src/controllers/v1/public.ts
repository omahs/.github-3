import { Get, Route } from "tsoa";
import type { IPingResponse, IStatusResponse, IStatsResponse } from "jewl-core";
import { Statistic, ServerStatus } from "jewl-core";

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

    @Get("/stats")
    public async getStats(): Promise<IStatsResponse> {
        const _stats = await Statistic.find();
        return {
            stats: []
        };
    }
}
