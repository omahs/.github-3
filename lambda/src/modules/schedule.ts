import chalk from "chalk";
import { DateTime } from "jewl-core";

/**
    Create a prefixed log message and write to the console.
**/
const log = (message: string): void => {
    const date = new Date();
    const formattedTime = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    console.info(
        chalk.bgBlue.bold(" CRON "),
        chalk.dim(formattedTime),
        message
    );
};

/**
    Run a task and log the status/result. If the key is an empty string
    no status is logged to the console. If the env variable VERBOSE is true
    full error messages (including traces) will be logged to the console.
**/
const runTask = async (key: string, task: () => Promise<void>): Promise<void> => {
    const startTime = new Date();
    const optionalLog = key === "" ? (): void => { /* Empty */ } : log;
    optionalLog(chalk.cyan(`Started cron job ${key}`));
    let success = false;
    try {
        await task();
        success = true;
    } catch (err) {
        const name = err instanceof Error ? err.name : "Unknown Error";
        const message = err instanceof Error ? err.message : "";
        console.error(chalk.bgRed.bold(" ERRO "), name, message);
        if (process.env.VERBOSE === "true") {
            console.error(err);
        }
    }
    const endTime = new Date();
    const duration = endTime.getTime() - startTime.getTime();
    optionalLog(chalk[success ? "green" : "red"](`Finished ${key} in ${duration} ms`));
};

/**
    A class that handles scheduling tasks and a specified minimum interval. This
    class has a method that runs periodically to check if it needs to run
    one or more tasks. The interval of the periodic method can be specified with
    the `minInterval` parameter.
**/
export class Lambda {
    private readonly tasks = new Map<string, () => Promise<void>>();
    private readonly minInterval = new Map<string, number>();
    private readonly lastExecution = new Map<string, DateTime>();
    private started = false;

    public constructor(minInterval = 1) {
        const spacer = async (): Promise<void> => new Promise<void>(resolve => { setTimeout(resolve, minInterval * 1000); });
        this.tasks.set("", spacer);
    }

    /**
        Add a task to the Lambda worker. You can specify the minimum interval
        which should be elapsed before running the task again. If the minimum
        interval is negative this task will only be run once during the lifetime
        of the Labda class. If no minimum interval is specified it defaults to -1.
        Specifying a minimum interval does not mean that this task will be run
        ever x seconds. This method can safely be called while the Lambda worker
        is running.
    **/
    public addTask(key: string, task: () => Promise<void>, minInterval = -1): void {
        this.tasks.set(key, task);
        this.minInterval.set(key, minInterval);
    }

    /**
        Remove a task from the Lambda worker using the key specified when adding.
        This will stop the Lambda worker from executing that task. This method can safely
        be called while the Lambda worker is running.
    **/
    public removeTask(key: string): void {
        this.tasks.delete(key);
    }

    /**
        Start the Lambda worker which will start the periodic execution of tasks. If
        the Lambda worker is already started this will throw an error.
    **/
    public start(): void {
        if (this.started) {
            throw Error("cron already started");
        }
        this.started = true;
        void this.runTasks();
    }

    /**
        Stop the Lambda worker which will stop the periodic execution of tasks. If
        the Lambda worker is not started this will throw an error.
    **/
    public stop(): void {
        if (!this.started) {
            throw Error("cron not stared");
        }
        this.started = false;
    }

    /**
        The function that that will be called on loop while the Lambda worker is active.
        This method checks all the tasks and if they need to be executed or not. Afterwards
        it schedules the next exectution of this same method. This loop is only broken when
        the `stop` method is called.
    **/
    private async runTasks(): Promise<void> {
        const promises: Array<Promise<void>> = [];

        for (const [key, task] of this.tasks) {
            const lastExecution = this.lastExecution.get(key) ?? new DateTime(0);
            const minInterval = this.minInterval.get(key) ?? 0;
            if (minInterval < 0) { continue; }
            if (lastExecution.addingSeconds(minInterval).gt(new DateTime())) { continue; }
            this.lastExecution.set(key, new DateTime());
            const promise = runTask(key, task);
            promises.push(promise);
        }

        await Promise.all(promises);

        if (this.started) {
            void this.runTasks();
        }
    }
}
