import { Get, Route } from "tsoa";
import type { IPingResponse, IStatsResponse } from "jewl-core";
import { Statistic } from "jewl-core";

@Route("/v1")
export class PublicController {
    @Get("/ping")
    public getMessage(): IPingResponse {
        return { message: "pong" };
    }

    @Get("/stats")
    public async getStats(): Promise<IStatsResponse> {
        const _stats = await Statistic.find();
        return {
            stats: []
        };
    }
}