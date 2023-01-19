import { mongoConnect, mongoDisconnect } from "jewl-core";
import chalk from "chalk";
import { scheduleTasks } from "./modules/schedule.js";
import { orderAndRefundJob } from "./jobs/order.js";
import { paymentJob } from "./jobs/payment.js";
import { transferJob } from "./jobs/transfer.js";
import { mailJob } from "./jobs/mail.js";

await mongoConnect(process.env.MONGO_URL ?? "");

console.info(
    chalk.bgMagenta.bold(" INFO "),
    "Starting up lambda worker"
);

// Every five minutes
const minute = scheduleTasks("*/5 * * * *", {
    mailJob
});

// Hourly
const hour = scheduleTasks("0 * * * *", {
    orderAndRefundJob,
    paymentJob,
    transferJob
});

const onExit = (): void => {
    [minute, hour].forEach(x => x.stop());
    void mongoDisconnect();
    console.info(
        chalk.bgMagenta.bold(" INFO "),
        "Shutting down gracefully"
    );
};

process.on("SIGINT", onExit);
process.on("SIGQUIT", onExit);
process.on("SIGTERM", onExit);

