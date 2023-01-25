import type { Model } from "mongoose";
import isomorphic from "jewl-isomorphic";
import { validate } from "./mongo.js";

export interface IRequest {
    method?: string;
    endpoint: string;
    body?: string;
    headers?: Record<string, string>;
}

class ClientError extends Error {
    public readonly status: number;
    public constructor(status: number, message: string) {
        super(message);
        this.status = status;
    }
}

export abstract class Client {
    private readonly baseUrl: string;

    private headers: Record<string, string>;

    public constructor(baseUrl: string, headers?: Record<string, string>) {
        this.baseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
        this.headers = headers ?? { };
    }

    public updateHeaders(update: Record<string, string>): void {
        for (const key in update) {
            this.headers[key] = update[key];
        }
    }

    public async request<T>(req: IRequest, schema: Model<T>): Promise<T> {
        const infix = req.endpoint.startsWith("/") ? "" : "/";
        const url: RequestInfo = this.baseUrl + infix + req.endpoint;
        const headers: HeadersInit = {
            ...this.headers,
            ...req.headers ?? { }
        };
        const request: RequestInit = {
            headers,
            method: req.method,
            body: req.body
        };
        const res = await isomorphic.fetch(url, request) as Response;
        if (res.status < 200 || res.status >= 300) {
            throw new ClientError(res.status, `received a status code of ${res.status} for ${req.endpoint}`);
        }
        let json = await res.json() as object;

        switch (typeof json) {
            case "string": json = { text: json }; break;
            case "number": json = { number: json }; break;
            case "boolean": json = { bool: json }; break;
            case "object": json = Array.isArray(json) ? { list: json } : json; break;
            default: break;
        }

        return validate(schema, json);
    }
}

declare global {
    interface Promise<T> {
        ignore: (statusCode: number | Array<number>) => Promise<T | null>;
    }
}

Promise.prototype.ignore = async function<T>(this: Promise<T>, statusCode: number | Array<number>): Promise<T | null> {
    const statusCodes = typeof statusCode === "number" ? [statusCode] : statusCode;
    try {
        const result = await this;
        return result;
    } catch (err) {
        if (err instanceof ClientError && statusCodes.includes(err.status)) {
            return null;
        }
        throw err;
    }
};
