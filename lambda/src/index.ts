import { mongoConnect, mongoDisconnect } from "jewl-core";
import chalk from "chalk";
import { Cron } from "./modules/schedule.js";
import { heartbeat } from "./jobs/heartbeat.js";
import { getSupportedCurrencies } from "./jobs/currency.js";

await mongoConnect(process.env.MONGO_URL ?? "");

console.info(
    chalk.bgMagenta.bold(" INFO "),
    "Starting up lambda worker"
);

const cron = new Cron();

cron.addTask("heartbeat", heartbeat);
cron.addTask("currencies", getSupportedCurrencies, false, 5);

cron.start();

const onExit = (): void => {
    cron.stop();
    void mongoDisconnect();
    console.info(
        chalk.bgMagenta.bold(" INFO "),
        "Shutting down gracefully"
    );
};

process.on("SIGINT", onExit);
process.on("SIGQUIT", onExit);
process.on("SIGTERM", onExit);
