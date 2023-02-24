import type { Application } from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { HttpError } from "./error.js";
import { ServerStatus, DateTime } from "jewl-core";
import { uptimeClient } from "./network.js";

export const RegisterSecurityMiddleware = (app: Application): void => {
    app.use(cors());
    app.use(rateLimit({
        windowMs: 60000,
        max: 50,
        legacyHeaders: false,
        standardHeaders: true
    }));
};

let previousStatus = ServerStatus.up;
let previousStatusExpires = new DateTime(0);
export const getServerStatus = async (): Promise<ServerStatus> => {
    if (previousStatusExpires.gt(new DateTime())) {
        return previousStatus;
    }

    previousStatusExpires = new DateTime().addingMinutes(3);

    try {
        const monitors = await uptimeClient.getMonitors();
        const heartbeats = await uptimeClient.getHeartbeats();
        const statuses = [...monitors.data, ...heartbeats.data];
        const isMaintainance = statuses.some(x => x.attributes.status === "maintainance");
        const isDown = statuses.some(x => x.attributes.status === "down");

        if (isMaintainance) {
            previousStatus = ServerStatus.maintainance;
        } else {
            previousStatus = isDown ? ServerStatus.down : ServerStatus.up;
        }
    } catch { /* Empty */ }

    return previousStatus;
};

export const expressAuthentication = async (_0: Request, _1: string, _2: Array<string>): Promise<void> => {
    if (await getServerStatus() === ServerStatus.maintainance) {
        throw new HttpError(503, "server down for maintainance");
    }
    return Promise.resolve();
};
