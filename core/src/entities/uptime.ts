import { Schema } from "mongoose";
import { createModel } from "../utility/mongo.js";

/**
    An enum explaining the status of a BetterUptime item.
**/
export enum UptimeStatus {

    /**
        The BetterUptime item is paused.
    **/
    Paused = "paused",

    /**
        The BetterUptime is just created and waiting for the
        first check.
    **/
    Pending = "pending",

    /**
        The BetterUptime item is paused because it is currently
        in its maintenance period.
    **/
    Maintainance = "maintenance",

    /**
        The BetterUptime item is passing all checks.
    **/
    Up = "up",

    /**
        The BetterUptime item seems to be back up, but the
        recovery_period since the last failed check hasn't passed.
    **/
    Validating = "validating",

    /**
        The BetterUptime item is failing one or more checks.
    **/
    Down = "down"
}

/**
    The attributes for a BetterUptime monitor or heartbeat.
**/
export interface IUptimeAttributes {

    /**
        The status of the BetterUptime monitor or heartbeat.
    **/
    status?: UptimeStatus;

    /**
        The id of the BetterUptime associated resource.
    **/
    resource_id?: number;
}

/**
    A Model for validating the `IUptimeAttributes` interface.
**/
export const UptimeAttributes = createModel<IUptimeAttributes>(
    new Schema<IUptimeAttributes>({
        status: { type: String, enum: UptimeStatus },
        resource_id: { type: Number }
    })
);

/**
    An BetterUptime item such as a monitor or heartbeat.
**/
export interface IUptimeItem {

    /**
        The id of the BetterUptime item.
    **/
    id: number;

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
        id: { type: Number, required: true },
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
