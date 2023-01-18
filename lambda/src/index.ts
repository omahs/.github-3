import { mongoConnect, mongoDisconnect } from "jewl-core";
import chalk from "chalk";
import { scheduleJobs } from "./modules/schedule.js";
import { orderAndRefundJob } from "./jobs/order.js";
import { paymentJob } from "./jobs/payment.js";
import { transferJob } from "./jobs/transfer.js";
import { mailJob } from "./jobs/mail.js";

await mongoConnect(process.env.MONGO_URL ?? "");

console.info(
    chalk.bgMagenta.bold(" INFO "),
    "Starting up lambda worker"
);

scheduleJobs("0 * * * *", {
    orderAndRefundJob,
    paymentJob,
    transferJob,
    mailJob
});

process.on("SIGINT", () => {
    void mongoDisconnect();
    console.info(
        chalk.bgMagenta.bold(" INFO "),
        "Shutting down gracefully"
    );
});

