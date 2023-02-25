import { mongoConnect, mongoDisconnect } from "jewl-core";
import chalk from "chalk";
import { Lambda } from "./modules/schedule.js";
import { heartbeat } from "./jobs/heartbeat.js";

/**
    Connect to the MongoDB instance using the url fetched from the
    env variables.
**/
await mongoConnect(process.env.MONGO_URL ?? "");

/**
    Log the lambda worker start to the console.
**/
console.info(
    chalk.bgMagenta.bold(" INFO "),
    "Starting up lambda worker"
);

/**
    Create the lambda worker.
**/
const lambda = new Lambda();

/**
    Register all the tasks into the lambda worker.
**/
lambda.addTask("heartbeat", heartbeat, 60);

/**
    Start the lambda worker which will continue until stopped.
**/
lambda.start();

/**
    Helper function which stops the lambda worker and disconnects
    from the MongoDB instance.
**/
const onExit = (): void => {
    lambda.stop();
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

