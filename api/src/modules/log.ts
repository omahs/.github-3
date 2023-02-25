import type { Application, NextFunction } from "express";
import type { IncomingMessage, ServerResponse } from "node:http";
import chalk from "chalk";
import onFinished from "on-finished";

/**
    Middleware that handles logging requests and errors. If
    the `VERBOSE` environment variable is turned on full errors
    (including stack traces) will be logged.
**/
export const RegisterLogger = (app: Application): void => {
    app.use((req: IncomingMessage, partial: ServerResponse, next: NextFunction) => {
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

        onFinished(partial, (_: Error | null, res: ServerResponse) => {
            const responseTime = new Date();
            const duration = responseTime.getTime() - requestTime.getTime();
            const formattedResponseTime = `${responseTime.toLocaleDateString()} ${responseTime.toLocaleTimeString()}`;
            console.info(
                chalk.bgBlue.bold(" HTTP "),
                chalk.dim(formattedResponseTime),
                chalk.yellow(ipAddress),
                chalk[res.statusCode < 400 ? "green" : "red"](`Returned ${res.statusCode} in ${duration} ms`)
            );
        });

        next();
    });
};
