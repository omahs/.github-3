import { Schema } from "mongoose";
import type { DateTime } from "../utility/date.js";
import { DateTimeSchema } from "../utility/date.js";
import { createModel } from "../utility/mongo.js";

/**
    A log item which represents a request made to one of
    the credited endpoints.
**/
export interface ILog {

    /**
        The userId of that created the log entry.
    **/
    userId: string;

    /**
        The endpoint that was hit.
    **/
    endpoint: string;

    /**
        The response status.
    **/
    status: number;

    /**
        The response that was returned at the time the request was made.
    **/
    response: string;

    /**
        The timestamp of the request.
    **/
    timestamp: DateTime;

    /**
        The amount of credits that were spent for this request.
    **/
    credits: number;

    /**
        The idempotency id to make sure the usage is not recorded multiple times.
    **/
    idempotencyId?: string;

    /**
        The id of the usage report to stripe.
    **/
    stripeId?: string;
}

/**
    A Model for validating the `ILog` interface.
**/
export const Log = createModel<ILog>(
    new Schema<ILog>({
        userId: { type: String, required: true, index: true },
        endpoint: { type: String, required: true },
        status: { type: Number, required: true },
        response: { type: String, required: true },
        timestamp: { ...DateTimeSchema, required: true },
        credits: { type: Number, required: true },
        idempotencyId: { type: String, sparse: true },
        stripeId: { type: String, sparse: true }
    }),
    "logs"
);

/**
    A log response item.
**/
export interface ILogResponse {

    /**
        The endpoint that was hit.
    **/
    endpoint: string;

    /**
        The response status.
    **/
    status: number;

    /**
        The response that was returned at the time the request was made.
    **/
    response: string;

    /**
        The timestamp of the request.
    **/
    timestamp: DateTime;

    /**
        The amount of credits that were spent for this request.
    **/
    credits: number;
}

/**
    A Model for validating the `ILogResponse` interface.
**/
export const LogResponse = createModel<ILogResponse>(
    new Schema<ILogResponse>({
        endpoint: { type: String, required: true },
        status: { type: Number, required: true },
        response: { type: String, required: true },
        timestamp: { ...DateTimeSchema, required: true },
        credits: { type: Number, required: true }
    })
);

/**
    A log response that contains a number of log items.
**/
export interface ILogsResponse {

    /**
        The individual log items.
    **/
    items: Array<ILogResponse>;

    /**
        A cursor for getting the next page of log items.
    **/
    next: number;
}

/**
    A Model for validating the `ILogsResponse` interface.
**/
export const LogsResponse = createModel<ILogsResponse>(
    new Schema<ILogsResponse>({
        items: { type: [LogResponse.schema], required: true },
        next: { type: Number, required: true }
    })
);
