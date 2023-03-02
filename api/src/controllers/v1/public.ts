import { Controller, Get, Route, SuccessResponse, Response } from "tsoa";
import type { IPingResponse, IStatusResponse } from "jewl-core";
import { ServerStatus, UptimeStatus, Cached } from "jewl-core";
import { uptimeClient } from "../../modules/network.js";

/**
    The previously returned status. This is cached for
    up to three minutes.
**/
const cachedStatus = new Cached(ServerStatus.Up, 300);

/**
    This method returns the server status and caches it for three
    mintues. If a cached status that has not expired that is
    returned. Otherwise it fetches the latest status from the
    BetterUptime api.
**/
const getServerStatus = async (): Promise<ServerStatus> => {
    let previousStatus = cachedStatus.get();
    if (previousStatus == null) {
        try {
            const statusMap = await uptimeClient.getStatus(155611);
            const statuses = Array.from(statusMap.values());
            const isMaintainance = statuses.some(x => x === UptimeStatus.Maintainance);
            const isDown = statuses.some(x => x === UptimeStatus.Down);

            if (isMaintainance) {
                previousStatus = ServerStatus.Maintainance;
            } else {
                previousStatus = isDown ? ServerStatus.Down : ServerStatus.Up;
            }
        } catch {
            previousStatus = ServerStatus.Down;
        }
        cachedStatus.set(previousStatus);
    }

    return previousStatus;
};

/**
    A controller for some public endpoint for health and status checks.
**/
@Route("/v1")
@Response<string>(429, "Too many requests")
export class PublicController extends Controller {

    /**
        Endpoint for testing the connection to the server. This endpoing
        will always respond with `pong` and does nothing else.
    **/
    @Get("/ping")
    @SuccessResponse(200, "Success")
    public getMessage(): IPingResponse {
        return { message: "pong" };
    }

    /**
        Get the status of all jewl.app services. This includes the api, web and
        lambda processor.
    **/
    @Get("/status")
    @SuccessResponse(200, "Success")
    public async getServerStatus(): Promise<IStatusResponse> {
        const status = await getServerStatus();
        return { status };
    }
}
