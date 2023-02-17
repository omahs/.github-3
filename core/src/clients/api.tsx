import type { IStatusResponse } from "../entities/public.js";
import { StatusResponse } from "../entities/public.js";
import type { ICurrencyResponse, IEstimateRequest, IEstimateResponse } from "../entities/swap.js";
import { CurrencyResponse } from "../entities/swap.js";
import { EstimateResponse } from "../entities/swap.js";
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

    public async getEstimate(body: IEstimateRequest): Promise<IEstimateResponse> {
        const request: IRequest = {
            endpoint: "v1/swap/estimate",
            method: "POST",
            body: JSON.stringify(body)
        };
        return this.request(request, EstimateResponse);
    }

    public async getCurrencies(): Promise<ICurrencyResponse> {
        const request: IRequest = {
            endpoint: "v1/swap/currency/all"
        };
        return this.request(request, CurrencyResponse);
    }

}

