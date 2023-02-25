import { Schema } from "mongoose";
import { createModel } from "../utility/mongo.js";

/**
    The attributes for a BetterUptime monitor or heartbeat.
**/
export interface IUptimeAttributes {

    /**
        The status of the BetterUptime monitor or heartbeat.
    **/
    status: string;
}

/**
    A Model for validating the `IUptimeAttributes` interface.
**/
export const UptimeAttributes = createModel<IUptimeAttributes>(
    new Schema<IUptimeAttributes>({
        status: { type: String, required: true }
    })
);

/**
    An BetterUptime item such as a monitor or heartbeat.
**/
export interface IUptimeItem {

    /**
        The attributes of the BetterUptime item.
    **/
    attributes: IUptimeAttributes;
}

/**
    A Model for validating the `IUptimeItem` interface.
**/
export const UptimeItem = createModel<IUptimeItem>(
    new Schema<IUptimeItem>({
        attributes: { type: UptimeAttributes.schema, required: true }
    })
);

/**
    An BetterUptime response for monitors or heartbeats.
**/
export interface IUptime {

    /**
        The individual BetterUptime items.
    **/
    data: Array<IUptimeItem>;
}

/**
    A Model for validating the `IUptime` interface.
**/
export const Uptime = createModel<IUptime>(
    new Schema<IUptime>({
        data: { type: [UptimeItem.schema], required: true }
    })
);
