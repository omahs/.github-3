import type { Application, NextFunction, Request, Response } from "express";
import chalk from "chalk";

export class HttpError extends Error {
    public status: number;

    public constructor(status: number, message: string) {
        super(message);
        this.status = status;
    }
}

export const RegisterErrorCatcher = (app: Application): void => {
    app.use((req: Request) => {
        throw new HttpError(404, `"${req.url}" is not found.`);
    });

    app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
        const isHandled = err instanceof HttpError;
        if (!isHandled) {
            console.error(chalk.bgRed.bold(" ERRO "), err.name, err.message);
            if (process.env.DEBUG === "true") {
                console.error(err);
            }
        }

        const status = isHandled ? err.status : 500;
        res.status(status).send(err.message);
    });
};
