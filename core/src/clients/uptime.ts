import type { IUptime } from "../entities/uptime.js";
import { Uptime } from "../entities/uptime.js";
import type { IRequest } from "../utility/client.js";
import { Client } from "../utility/client.js";

export class UptimeClient extends Client {
    public constructor(url: string, key: string) {
        const staticHeaders = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${key}`
        };
        super(url, staticHeaders);
    }

    public async getMonitors(): Promise<IUptime> {
        const request: IRequest = {
            endpoint: "v2/monitors"
        };
        return this.request(request, Uptime);
    }

    public async getHeartbeats(): Promise<IUptime> {
        const request: IRequest = {
            endpoint: "v2/heartbeats"
        };
        return this.request(request, Uptime);
    }

}
