import type { Application } from "express";
import express from "express";
import chalk from "chalk";
import { RegisterRoutes } from "./modules/routes.gen.js";
import { RegisterLogger } from "./modules/log.js";
import { RegisterRequestParser } from "./modules/request.js";
import { RegisterErrorCatcher } from "./modules/error.js";
import { RegisterDocs } from "./modules/docs.js";
import { RegisterSecurityMiddleware } from "./modules/security.js";
import { mongoConnect, mongoDisconnect } from "jewl-core";

await mongoConnect(process.env.MONGO_URL ?? "");

const app: Application = express();
const middlewares = [
    RegisterLogger,
    RegisterRequestParser,
    RegisterSecurityMiddleware,
    RegisterRoutes,
    RegisterDocs,
    RegisterErrorCatcher
];
middlewares.forEach(x => x(app));
const server = app.listen(process.env.PORT);

console.info(
    chalk.bgMagenta.bold(" INFO "),
    `Accepting connections at http://localhost:${process.env.PORT}`
);

const onExit = (): void => {
    server.close();
    void mongoDisconnect();
    console.info(
        chalk.bgMagenta.bold(" INFO "),
        "Shutting down gracefully"
    );
};

process.on("SIGINT", onExit);
process.on("SIGQUIT", onExit);
process.on("SIGTERM", onExit);
