import type { IStatusResponse } from "../entities/public.js";
import { StatusResponse } from "../entities/public.js";
import type { IRequest } from "../utility/client.js";
import { Client } from "../utility/client.js";

/**
    A client for talking to the jewl.app api.
**/
export class ApiClient extends Client {
    public constructor(url: string) {
        const staticHeaders = {
            "Content-Type": "application/json"
        };
        super(url, staticHeaders);
    }

    /**
        Calls the `v1/status` endpoint and returns the result.
    **/
    public async getStatus(): Promise<IStatusResponse> {
        const request: IRequest = {
            endpoint: "v1/status"
        };
        return this.request(request, StatusResponse);
    }

}

