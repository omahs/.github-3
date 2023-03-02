import type { Application, NextFunction, Request, Response } from "express";
import chalk from "chalk";
import { onSend } from "./hooks.js";

/**
    Middleware that handles logging requests and errors. If
    the `VERBOSE` environment variable is turned on full errors
    (including stack traces) will be logged.
**/
export const RegisterLogger = (app: Application): void => {
    app.use((req: Request, _: Response, next: NextFunction) => {
        const requestTime = new Date();
        const formattedTime = `${requestTime.toLocaleDateString()} ${requestTime.toLocaleTimeString()}`;
        const ipAddress = req.socket.remoteAddress?.replace("::ffff:", "") ?? "unknown";
        const requestUrl = `${req.method ?? "GET"} ${req.url ?? "/"}`;

        console.info(
            chalk.bgBlue.bold(" HTTP "),
            chalk.dim(formattedTime),
            chalk.yellow(ipAddress),
            chalk.cyan(requestUrl)
        );

        onSend(req, () => {
            const status = req.res?.statusCode ?? 500;
            const responseTime = new Date();
            const duration = responseTime.getTime() - requestTime.getTime();
            const formattedResponseTime = `${responseTime.toLocaleDateString()} ${responseTime.toLocaleTimeString()}`;
            console.info(
                chalk.bgBlue.bold(" HTTP "),
                chalk.dim(formattedResponseTime),
                chalk.yellow(ipAddress),
                chalk[status < 400 ? "green" : "red"](`Returned ${status} in ${duration} ms`)
            );
        });

        next();
    });
};
