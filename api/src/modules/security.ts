import type { Application } from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";

/**
    Middleware that adds a couple of security features to the
    application. (1) adds cors headers to the response. (2) adds
    rate limiting to the api at a maximum of 100 requests per
    minute per ip.
**/
export const RegisterSecurityMiddleware = (app: Application): void => {
    app.use(cors());
    app.use(rateLimit({
        windowMs: 60000,
        max: 100,
        legacyHeaders: false,
        standardHeaders: true
    }));
};

