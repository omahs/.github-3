import { mongoConnect, mongoDisconnect } from "jewl-core";
import chalk from "chalk";
import { scheduleJobs } from "./modules/schedule.js";
import { orderCronJob } from "./jobs/order.js";
import { paymentCronJob } from "./jobs/payment.js";

await mongoConnect(process.env.MONGO_URL ?? "");

console.info(
    chalk.bgMagenta.bold(" INFO "),
    "Starting up lambda worker"
);

scheduleJobs("0 * * * *", {
    orderCronJob,
    paymentCronJob
});

process.on("SIGINT", () => {
    void mongoDisconnect();
    console.info(
        chalk.bgMagenta.bold(" INFO "),
        "Shutting down gracefully"
    );
});

