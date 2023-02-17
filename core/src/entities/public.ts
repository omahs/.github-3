import { Schema } from "mongoose";
import { createModel } from "../utility/mongo.js";

export interface IPingResponse {
    message: string;
}

export const PingResponseSchema = new Schema<IPingResponse>({
    message: { type: String, required: true }
});

export const PingResponse = createModel<IPingResponse>(PingResponseSchema);

export enum ServerStatus {
    up = 0,
    down = 1,
    maintainance = 2
}

export interface IStatusResponse {
    status: ServerStatus;
}

export const StatusResponseSchema = new Schema<IStatusResponse>({
    status: { type: Number, enum: ServerStatus, required: true }
});

export const StatusResponse = createModel<IStatusResponse>(StatusResponseSchema);
