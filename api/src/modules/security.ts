import type { Application } from "express";
import cors from "cors";
import slowDown from "express-slow-down";

export const RegisterSecurityMiddleware = (app: Application): void => {
    app.use(cors());
    app.use(slowDown({
        windowMs: 60,
        delayAfter: 100,
        delayMs: 500
    }));
};
