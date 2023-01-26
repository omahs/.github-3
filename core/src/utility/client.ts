
import type { Model } from "mongoose";
import isomorphic from "jewl-isomorphic";
import { validate } from "./mongo.js";

export interface IRequest {
    method?: string;
    endpoint: string;
    body?: string;
    headers?: Record<string, string>;
}

const toKey = (req: IRequest): string => {
    return `${req.endpoint}${req.method ?? "GET"}${req.body ?? ""}`;
};

class ClientError extends Error {
    public readonly status: number;
    public constructor(status: number, message: string) {
        super(message);
        this.status = status;
    }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
interface ClientQueueItem {
    resolve: (value: any) => void;
    reject: (reason?: any) => void;
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export abstract class Client {
    private readonly baseUrl: string;
    private headers: Record<string, string>;
    private readonly queue = new Map<string, Array<ClientQueueItem>>();

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
        if (this.queue.has(toKey(req))) {
            return new Promise<T>((resolve, reject) => {
                this.queue.get(toKey(req))?.push({ resolve, reject });
            });
        }

        this.queue.set(toKey(req), []);

        try {
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

            const response = await validate(schema, json);
            this.queue.get(toKey(req))?.forEach(x => x.resolve(response));
            return response;
        } catch (error) {
            this.queue.get(toKey(req))?.forEach(x => x.reject(error));
            throw error;
        } finally {
            this.queue.delete(toKey(req));
        }
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
