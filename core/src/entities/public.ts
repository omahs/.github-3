import { Schema } from "mongoose";
import { createModel } from "../utility/mongo.js";

/**
    A ping response.
**/
export interface IPingResponse {

    /**
        Pong!
    **/
    message: string;
}

/**
    A Model for validating the `IPingResponse` interface.
**/
export const PingResponse = createModel<IPingResponse>(
    new Schema<IPingResponse>({
        message: { type: String, required: true }
    })
);

/**
    An enum explaining the current server status.
**/
export enum ServerStatus {

    /**
        Server is functioning normally.
    **/
    Up = "up",

    /**
        One or more of the services are down.
    **/
    Down = "down",

    /**
        The server is currently in maintainance mode.
    **/
    Maintainance = "maintainance"
}

/**
    A response containing the server status.
**/
export interface IStatusResponse {

    /**
        The actual server status.
    **/
    status: ServerStatus;
}

/**
    A Model for validating the `IStatusResponse` interface.
**/
export const StatusResponse = createModel<IStatusResponse>(
    new Schema<IStatusResponse>({
        status: { type: String, enum: ServerStatus, required: true }
    })
);
