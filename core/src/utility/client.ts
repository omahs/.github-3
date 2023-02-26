import type { Model } from "mongoose";
import isomorphic from "jewl-isomorphic";
import { validate } from "./mongo.js";

/**
    An inteface for an object that holds all the
    information to make a request to an endpoint.
**/
export interface IRequest {

    /**
        The method of the request. If this is
        omitted it defaults to a `GET` request.
    **/
    method?: string;

    /**
        The fully qualified endpoint url to hit.
    **/
    endpoint: string;

    /**
        An optional query component to add to the
        request. Ideally this is created using
        the `URLSearchParams.toString()` method.
    **/
    query?: string;

    /**
        An optional body component to add to the
        request. Ideally this is created using
        `JSON.stringify()` for json bodies or
        `URLSearchParams.toString()` for urlencoded
        bodies.
    **/
    body?: string;

    /**
        An optional headers component to add to the
        request.
    **/
    headers?: Record<string, string>;
}

/**
    An internal Error class used for capturing bad
    status codes. This is used to ignore certain status
    codes if they can be expect.
**/
class ClientError extends Error {
    public readonly status: number;
    public constructor(status: number, message: string) {
        super(message);
        this.status = status;
    }
}

/**
    An abstract client class that should be subclassed.
    This class contains some helper functions for making a
    request to an endpoint using the `IRequest` interface.
**/
export abstract class Client {
    private readonly baseUrl: string;
    private headers: Record<string, string>;

    public constructor(baseUrl: string, headers?: Record<string, string>) {
        this.baseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
        this.headers = headers ?? { };
    }

    /**
        Add headers tot the client that will be sent with every
        request that is made. This method adds the headers specified
        in the `update` parameter (overriding if they already exist).
        Headers can be overriden for one request specifically by
        specifying the header in the request.
    **/
    public updateHeaders(update: Record<string, string>): void {
        for (const key in update) {
            this.headers[key] = update[key];
        }
    }

    /**
        Make a request to and endpoint and validate the result using
        a `Model`. This method formulates the request based on the
        `IRequest` parameter and parses the result and status code.
        Any status in the `200 <= x < 300` range is seen as a valid
        response. The `Model` is then used to validate that the response
        body is valid. On an invalid status code the response body
        is ignored.
    **/
    public async request<T>(req: IRequest, schema: Model<T>): Promise<T> {
        const infix = req.endpoint.startsWith("/") ? "" : "/";
        let url: RequestInfo = this.baseUrl + infix + req.endpoint;
        if (req.query != null) {
            url = `${url}?${req.query}`;
        }

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
            console.log(await res.json());
            throw new Error(`received a status code of ${res.status} for ${req.endpoint}`);
        }

        let json = res.status === 204 ? { } : await res.json() as object;

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

        /**
            Ignore a specific status code (or list of staus codes).
            This method turns the response nullable since for non-2xx
            status codes the response body is not parsed.
        **/
        ignore: (statusCode: number | Array<number>) => Promise<T | null>;
    }
}

/**
    Implementation of the `ignore` method. This method catches a `ClientError`
    and returns null if that specific status code should be ignored. Otherwise
    this method will propogate the error.
**/
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
