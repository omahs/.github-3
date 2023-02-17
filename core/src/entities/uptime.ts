import { Schema } from "mongoose";
import { createModel } from "../utility/mongo.js";

export interface IUptimeAttributes {
    status: string;
}

export const UptimeAttributesSchema = new Schema<IUptimeAttributes>({
    status: { type: String, required: true }
});

export const UptimeAttributes = createModel<IUptimeAttributes>(UptimeAttributesSchema);

export interface IUptimeItem {
    attributes: IUptimeAttributes;
}

export const UptimeItemSchema = new Schema<IUptimeItem>({
    attributes: { type: UptimeAttributesSchema, required: true }
});

export const UptimeItem = createModel<IUptimeItem>(UptimeItemSchema);

export interface IUptime {
    data: Array<IUptimeItem>;
}

export const UptimeSchema = new Schema<IUptime>({
    data: { type: [UptimeItemSchema], required: true }
});

export const Uptime = createModel<IUptime>(UptimeSchema);
