import type { IPaymentResponse, IPaymentSetupRequest, IPaymentSetupResponse } from "../entities/payment.js";
import { PaymentResponse, PaymentSetupResponse } from "../entities/payment.js";
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
        const response = await this.request(request, PaymentResponse);
        return response;
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

        const response = await this.request(request, PaymentSetupResponse);
        return response;
    }

    public async deletePaymentMethod(token: string): Promise<void> {
        const request: IRequest = {
            endpoint: "v1/payment",
            headers: { Authorization: `Bearer ${token}` },
            method: "DELETE"
        };
        await this.request(request, PaymentResponse);
    }
}

