import type { Application } from "express";
import express from "express";
import chalk from "chalk";
import { RegisterRoutes } from "./modules/routes.gen.js";
import { RegisterLogger } from "./modules/log.js";
import { RegisterRequestParser } from "./modules/request.js";
import { RegisterErrorCatcher } from "./modules/error.js";
import { RegisterSecurityMiddleware } from "./modules/security.js";
import { mongoConnect, mongoDisconnect } from "jewl-core";

/**
    Connect to the MongoDB instance using the url fetched from the
    env variables.
**/
await mongoConnect(process.env.MONGO_URL ?? "");

/**
    Create the express application
**/
const app: Application = express();

/**
    Createa a list of middlewares and register them into the
    express application. Please keep in mind the sorting of
    this array matters as middlewares will be resolved in this
    order.
**/
[
    RegisterLogger,
    RegisterRequestParser,
    RegisterSecurityMiddleware,
    RegisterRoutes,
    RegisterErrorCatcher
].forEach(x => x(app));

/**
    Start listening on the port specified in the env variables.
**/
const server = app.listen(process.env.PORT);

/**
    Log the express application start to the console.
**/
console.info(
    chalk.bgMagenta.bold(" INFO "),
    `Accepting connections at http://localhost:${process.env.PORT}`
);

/**
    Helper function which closes the server and disconnects from
    the MongoDB instance.
**/
const onExit = (): void => {
    server.close();
    void mongoDisconnect();
    console.info(
        chalk.bgMagenta.bold(" INFO "),
        "Shutting down gracefully"
    );
};

/**
    Call the onExit method on various termination signals.
**/
process.on("SIGINT", onExit);
process.on("SIGQUIT", onExit);
process.on("SIGTERM", onExit);
