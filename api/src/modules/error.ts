import type { Application, NextFunction, Request, Response } from "express";
import chalk from "chalk";

/**
    Error class to throw when you want the api to return a
    specific status code in the response. Responses when
    an error are thrown are always of type `string`.
**/
export class HttpError extends Error {
    public status: number;

    public constructor(status: number, message: string) {
        super(message);
        this.status = status;
    }
}

/**
    Middleware to errors that happen due to one of the
    following two reasons. (1) the server returns a 404 error
    when the specific route cannot be found and (2) the server
    returns a specific status code when a `HttpError` is thrown.
**/
export const RegisterErrorCatcher = (app: Application): void => {
    app.use((req: Request) => {
        throw new HttpError(404, `"${req.url}" not found.`);
    });

    app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
        const isHandled = err instanceof HttpError;
        if (!isHandled) {
            console.error(chalk.bgRed.bold(" ERRO "), err.name, err.message);
            if (process.env.VERBOSE === "true") {
                console.error(err);
            }
        }

        const status = isHandled ? err.status : 500;
        res.status(status).send(err.message);
    });
};
