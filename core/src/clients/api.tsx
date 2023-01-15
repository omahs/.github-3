import type { IPaymentResponse, IPaymentSetupRequest, IPaymentSetupResponse } from "../entities/payment.js";
import { PaymentResponse, PaymentSetupResponse } from "../entities/payment.js";
import { NoResponse } from "../entities/void.js";
import type { IRequest } from "../utility/client.js";
import { Client } from "../utility/client.js";

export class ApiClient extends Client {
    public constructor(url: string) {
        const staticHeaders = {
            "Content-Type": "application/json"
        };
        super(url, staticHeaders);
    }

    public async getPaymentMethod(token: string): Promise<IPaymentResponse> {
        const request: IRequest = {
            endpoint: "v1/payment",
            headers: { Authorization: `Bearer ${token}` }
        };
        return this.request(request, PaymentResponse);
    }

    public async setupPaymentMethod(token: string, callback: URL): Promise<IPaymentSetupResponse> {
        const body: IPaymentSetupRequest = {
            callback
        };
        const request: IRequest = {
            endpoint: "v1/payment",
            headers: { Authorization: `Bearer ${token}` },
            method: "POST",
            body: JSON.stringify(body)
        };

        return this.request(request, PaymentSetupResponse);
    }

    public async deletePaymentMethod(token: string): Promise<object> {
        const request: IRequest = {
            endpoint: "v1/payment",
            headers: { Authorization: `Bearer ${token}` },
            method: "DELETE"
        };
        return this.request(request, NoResponse);
    }
}

