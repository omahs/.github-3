import type { IStatusResponse } from "../entities/public.js";
import { StatusResponse } from "../entities/public.js";
import type { IRequest } from "../utility/client.js";
import { Client } from "../utility/client.js";

export class ApiClient extends Client {
    public constructor(url: string) {
        const staticHeaders = {
            "Content-Type": "application/json"
        };
        super(url, staticHeaders);
    }

    public async getStatus(): Promise<IStatusResponse> {
        const request: IRequest = {
            endpoint: "v1/status"
        };
        return this.request(request, StatusResponse);
    }

}

