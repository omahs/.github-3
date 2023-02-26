import { UptimeStatus } from "../entities/uptime.js";
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
        This method looks up a BetterUptime status page and returs the status
        for each of the resources on that status page. This method consolidates
        three requests to the BetterUptime API and returns a single result. Firstly
        it gets the status page information and a list of resources on that status
        page. Then it finds all monitors and lastly all heartbeats. Finally only
        status for the monitors and hartbeats that appear on the status page are
        returned.
    **/
    public async getStatus(pageId: number): Promise<Map<number, UptimeStatus>> {
        const pageRequest: IRequest = { endpoint: `v2/status-pages/${pageId}/resources` };
        const monitorsRequest: IRequest = { endpoint: "v2/monitors" };
        const heartbeatsRequest: IRequest = { endpoint: "v2/heartbeats" };
        const requests = [
            this.request(pageRequest, Uptime),
            this.request(monitorsRequest, Uptime),
            this.request(heartbeatsRequest, Uptime)
        ];

        const responses = await Promise.all(requests);
        const ids = new Set(responses[0].data.map(x => x.attributes.resource_id ?? 0));
        const result = new Map<number, UptimeStatus>();
        const items = responses[1].data.concat(responses[2].data);
        for (const item of items) {
            if (!ids.has(item.id)) { continue; }
            result.set(item.id, item.attributes.status ?? UptimeStatus.Down);
        }

        return result;
    }
}
