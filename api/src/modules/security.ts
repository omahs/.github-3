import type { Application } from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";

export const RegisterSecurityMiddleware = (app: Application): void => {
    app.use(cors());
    app.use(rateLimit({
        windowMs: 60000,
        max: 100,
        legacyHeaders: false,
        standardHeaders: true
    }));
};

