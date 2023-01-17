import type { Model } from "mongoose";
import type { IAuthUser } from "../entities/auth.js";
import { AuthUser, AuthToken } from "../entities/auth.js";
import type { IRequest } from "../utility/client.js";
import { Client } from "../utility/client.js";

export class AuthClient extends Client {
    private readonly clientId: string;
    private readonly clientSecret: string;
    private readonly url: string;

    public constructor(url: string, id: string, secret: string) {
        const staticHeaders = {
            "Content-Type": "application/json"
        };
        super(url, staticHeaders);
        this.url = url;
        this.clientId = id;
        this.clientSecret = secret;
    }

    public async getUser(userId: string): Promise<IAuthUser> {
        const request: IRequest = {
            endpoint: `api/v2/users/${encodeURIComponent(userId)}`
        };
        return this.request(request, AuthUser);
    }

    private async getAccessToken(): Promise<string> {
        const data = {
            client_id: this.clientId,
            client_secret: this.clientSecret,
            audience: `${this.url}/api/v2/`,
            grant_type: "client_credentials"
        };
        const request: IRequest = {
            endpoint: "/oauth/token",
            method: "POST",
            body: JSON.stringify(data)
        };
        const response = await super.request(request, AuthToken);
        return response.access_token;
    }

    public override async request<T>(req: IRequest, schema: Model<T>): Promise<T> {
        const token = await this.getAccessToken();

        const originalHeaders = req.headers ?? { };
        req.headers = {
            ...originalHeaders,
            Authorization: `Bearer ${token}`
        };

        return super.request(req, schema);
    }

}
