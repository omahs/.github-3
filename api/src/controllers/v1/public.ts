import { Get, Hidden, Route } from "tsoa";
import type { IPingResponse, IStatusResponse } from "jewl-core";
import { DateTime, ServerStatus } from "jewl-core";
import { uptimeClient } from "../../modules/network.js";

let previousStatus = ServerStatus.up;
let previousStatusExpires = new DateTime(0);
const getServerStatus = async (): Promise<ServerStatus> => {
    if (previousStatusExpires.gt(new DateTime())) {
        return previousStatus;
    }

    previousStatusExpires = new DateTime().addingMinutes(3);

    try {
        const monitors = await uptimeClient.getMonitors();
        const heartbeats = await uptimeClient.getHeartbeats();
        const statuses = [...monitors.data, ...heartbeats.data];
        const isMaintainance = statuses.some(x => x.attributes.status === "maintainance");
        const isDown = statuses.some(x => x.attributes.status === "down");

        if (isMaintainance) {
            previousStatus = ServerStatus.maintainance;
        } else {
            previousStatus = isDown ? ServerStatus.down : ServerStatus.up;
        }
    } catch {
        previousStatus = ServerStatus.down;
    }

    return previousStatus;
};


@Route("/v1")
@Hidden()
export class PublicController {

    /**
        Endpoint for testing the connection to the server. This endpoing
        will always respond with `pong` and does nothing else.
    **/
    @Get("/ping")
    public getMessage(): IPingResponse {
        return { message: "pong" };
    }

    /**
        Get the status of all jewl.app services. This includes the api, web and
        lambda processor.
    **/
    @Get("/status")
    public async getStatus(): Promise<IStatusResponse> {
        const status = await getServerStatus();
        return { status };
    }
}
