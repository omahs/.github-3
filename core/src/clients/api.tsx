import type { IAllocationItem, IAllocationRequest, IPaymentMethodResponse, IPaymentMethodSetupRequest, IPaymentMethodSetupResponse } from "../entities/user.js";
import { AllocationResponse } from "../entities/user.js";
import { PaymentMethodResponse, PaymentMethodSetupResponse } from "../entities/user.js";
import type { IStatsResponse, IStatusResponse } from "../entities/public.js";
import { StatsResponse, StatusResponse } from "../entities/public.js";
import { NoResponse } from "../entities/void.js";
import type { IRequest } from "../utility/client.js";
import { Client } from "../utility/client.js";
import type { IPaymentRequest, IPaymentResponse, OrderPeriod } from "../entities/payment.js";
import { PaymentResponse } from "../entities/payment.js";
import type { PreciseNumber } from "../utility/number.js";

export class ApiClient extends Client {
    public constructor(url: string) {
        const staticHeaders = {
            "Content-Type": "application/json"
        };
        super(url, staticHeaders);
    }

    public async status(): Promise<IStatusResponse> {
        const request: IRequest = {
            endpoint: "v1/status"
        };
        return this.request(request, StatusResponse);
    }

    public async getStats(): Promise<IStatsResponse> {
        const request: IRequest = {
            endpoint: "v1/stats"
        };
        return this.request(request, StatsResponse);
    }

    public async getPaymentMethod(token: string): Promise<IPaymentMethodResponse> {
        const request: IRequest = {
            endpoint: "v1/user/payment",
            headers: { Authorization: `Bearer ${token}` }
        };
        return this.request(request, PaymentMethodResponse);
    }

    public async setupPaymentMethod(token: string, callback: URL): Promise<IPaymentMethodSetupResponse> {
        const body: IPaymentMethodSetupRequest = {
            callback
        };
        const request: IRequest = {
            endpoint: "v1/user/payment",
            headers: { Authorization: `Bearer ${token}` },
            method: "POST",
            body: JSON.stringify(body)
        };

        return this.request(request, PaymentMethodSetupResponse);
    }

    public async deletePaymentMethod(token: string): Promise<object> {
        const request: IRequest = {
            endpoint: "v1/user/payment",
            headers: { Authorization: `Bearer ${token}` },
            method: "DELETE"
        };
        return this.request(request, NoResponse);
    }

    public async refundOrders(token: string): Promise<object> {
        const request: IRequest = {
            endpoint: "v1/payment",
            headers: { Authorization: `Bearer ${token}` },
            method: "DELETE"
        };
        return this.request(request, NoResponse);
    }

    public async setAutoRenew(token: string, enabled: boolean): Promise<object> {
        const request: IRequest = {
            endpoint: "v1/payment/renew",
            headers: { Authorization: `Bearer ${token}` },
            method: enabled ? "PUT" : "DELETE"
        };
        return this.request(request, NoResponse);
    }

    public async getLastPayment(token: string): Promise<IPaymentResponse | null> {
        const request: IRequest = {
            endpoint: "v1/payment/last",
            headers: { Authorization: `Bearer ${token}` }
        };
        return this.request(request, PaymentResponse).ignore(404);
    }

    public async initiatePayment(token: string, amount: PreciseNumber, installments: number, period: OrderPeriod, autoRenew: boolean): Promise<object> {
        const body: IPaymentRequest = {
            amount,
            installments,
            period,
            autoRenew
        };
        const request: IRequest = {
            endpoint: "v1/payment",
            headers: { Authorization: `Bearer ${token}` },
            method: "POST",
            body: JSON.stringify(body)
        };
        return this.request(request, NoResponse);
    }

    public async getAllocation(token: string): Promise<Array<IAllocationItem> | null> {
        const request: IRequest = {
            endpoint: "v1/user/allocation",
            headers: { Authorization: `Bearer ${token}` }
        };
        return this.request(request, AllocationResponse).then(x => x.allocation).ignore(404);
    }

    public async setAllocation(token: string, allocation: Array<IAllocationItem>): Promise<object> {
        const body: IAllocationRequest = {
            allocation
        };
        const request: IRequest = {
            endpoint: "v1/user/allocation",
            headers: { Authorization: `Bearer ${token}` },
            method: "PUT",
            body: JSON.stringify(body)
        };
        return this.request(request, NoResponse);
    }
}

