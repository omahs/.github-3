import { Schema } from "mongoose";
import { createModel } from "../utility/mongo.js";
import type { PreciseNumber } from "../utility/number.js";
import { PreciseNumberSchema } from "../utility/number.js";

export interface IPingResponse {
    message: string;
}

export const PingResponseSchema = new Schema<IPingResponse>({
    message: { type: String, required: true }
});

export const PingResponse = createModel<IPingResponse>(PingResponseSchema);

export enum ServerStatus {
    normal = 0,
    maintainance = 1
}

export interface IStatusResponse {
    status: ServerStatus;
}

export const StatusResponseSchema = new Schema<IStatusResponse>({
    status: { type: Number, enum: ServerStatus, required: true }
});

export const StatusResponse = createModel<IStatusResponse>(StatusResponseSchema);

export interface IStatistic {
    metric: string;
    value: PreciseNumber;
}

export const StatisticSchema = new Schema<IStatistic>({
    metric: { type: String, required: true, unique: true },
    value: { ...PreciseNumberSchema, required: true }
});

export const Statistic = createModel<IStatistic>(StatisticSchema, "stats");

export interface IStatsResponse {
    stats: Array<IStatistic>;
}

export const StatsResponseSchema = new Schema<IStatsResponse>({
    stats: { type: [StatisticSchema], required: true }
});

export const StatsResponse = createModel<IStatsResponse>(StatsResponseSchema);
