import { mongoConnect, mongoDisconnect } from "jewl-core";
import chalk from "chalk";
import { scheduleTasks } from "./modules/schedule.js";
import { orderAndRefundJob } from "./jobs/order.js";
import { paymentJob } from "./jobs/payment.js";
import { transferJob } from "./jobs/transfer.js";
import { mailJob } from "./jobs/mail.js";
import { announcePaymentJob } from "./jobs/announce.js";
import { heartbeatJob } from "./jobs/heartbeat.js";
import { statsJob } from "./jobs/stats.js";

await mongoConnect(process.env.MONGO_URL ?? "");

console.info(
    chalk.bgMagenta.bold(" INFO "),
    "Starting up lambda worker"
);

// Every five minutes
const minute = scheduleTasks("*/5 * * * *", {
    mailJob,
    heartbeatJob
});

// Hourly
const hour = scheduleTasks("0 * * * *", {
    orderAndRefundJob,
    paymentJob,
    transferJob
});

// Daily at 10 am
const day = scheduleTasks("0 10 * * *", {
    announcePaymentJob,
    statsJob
});

const onExit = (): void => {
    [minute, hour, day].forEach(x => x.stop());
    void mongoDisconnect();
    console.info(
        chalk.bgMagenta.bold(" INFO "),
        "Shutting down gracefully"
    );
};

process.on("SIGINT", onExit);
process.on("SIGQUIT", onExit);
process.on("SIGTERM", onExit);
