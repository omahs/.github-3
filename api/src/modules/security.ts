import type { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import slowDown from "express-slow-down";
import { HttpError } from "./error.js";

export const RegisterSecurityMiddleware = (app: Application): void => {
    app.use(cors());
    app.use(slowDown({
        windowMs: 60,
        delayAfter: 100,
        delayMs: 500
    }));

    app.use((_0: Request, res: Response, next: NextFunction) => {
        if (process.env.MAINTAINANCE === "true") {
            throw new HttpError(503, "server down for maintainance");
        }
        next();
    });
};
