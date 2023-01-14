import { mongoConnect, mongoDisconnect } from "jewl-core";
import chalk from "chalk";
import { scheduleJobs } from "./modules/schedule.js";
import { sampleCronJob } from "./jobs/simple.js";

await mongoConnect(process.env.MONGO_URL ?? "");

console.info(
    chalk.bgMagenta.bold(" INFO "),
    "Starting up lambda worker"
);

scheduleJobs("0 * * * *", {
    sampleCronJob
});

process.on("SIGINT", () => {
    void mongoDisconnect();
    console.info(
        chalk.bgMagenta.bold(" INFO "),
        "Shutting down gracefully"
    );
});


// For each currency:
// Close current coinbase order (if there is one)
// Close orders for which a refund has been requested and add amount to the refund object. Need to know the eurEquavalent of this
// Payout oldest order until remaining balance is no longer sufficient
// Run through all db orders get the sum of still pending
// Diff between requiredOrder and remainingBalance is the new orderSize
// Get a nice limit price
// Place new order
// Issue refunds

