import { Schema } from "mongoose";
import { createModel } from "../utility/mongo.js";

/**
    A log response item.
**/
export interface ILogResponse {

    /**
        Just a property.
    **/
    palaceholder: string;
}

/**
    A Model for validating the `ILogResponse` interface.
**/
export const LogResponse = createModel<ILogResponse>(
    new Schema<ILogResponse>({
        palaceholder: { type: String, required: true }
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
