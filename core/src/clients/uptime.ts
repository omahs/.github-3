import type { IUptime } from "../entities/uptime.js";
import { Uptime } from "../entities/uptime.js";
import type { IRequest } from "../utility/client.js";
import { Client } from "../utility/client.js";

/**
    A client for talking to the BetterUptime api.
**/
export class UptimeClient extends Client {
    public constructor(url: string, key: string) {
        const staticHeaders = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${key}`
        };
        super(url, staticHeaders);
    }

    /**
        Get a list of monitors currently active. This endpoint
        is originally paginated but for this purpose we'll never
        reach page two so pagination is ignored.
    **/
    public async getMonitors(): Promise<IUptime> {
        const request: IRequest = {
            endpoint: "v2/monitors"
        };
        return this.request(request, Uptime);
    }

    /**
        Get a list of heartbeats currently active. This endpoint
        is originally paginated but for this purpose we'll never
        reach page two so pagination is ignored.
    **/
    public async getHeartbeats(): Promise<IUptime> {
        const request: IRequest = {
            endpoint: "v2/heartbeats"
        };
        return this.request(request, Uptime);
    }

}
