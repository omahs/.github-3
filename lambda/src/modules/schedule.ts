import chalk from "chalk";
import { DateTime } from "jewl-core";

const log = (message: string): void => {
    const date = new Date();
    const formattedTime = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    console.info(
        chalk.bgBlue.bold(" CRON "),
        chalk.dim(formattedTime),
        message
    );
};

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

export class Cron {
    private readonly tasks = new Map<string, () => Promise<void>>();
    private readonly minInterval = new Map<string, number>();
    private readonly lastExecution = new Map<string, DateTime>();
    private started = false;

    public constructor(minInterval = 1) {
        const spacer = async (): Promise<void> => new Promise<void>(resolve => { setTimeout(resolve, minInterval * 1000); });
        this.tasks.set("", spacer);
    }

    public addTask(key: string, task: () => Promise<void>, minInterval = 60): void {
        this.tasks.set(key, task);
        this.minInterval.set(key, minInterval);
    }

    public removeTask(key: string): void {
        this.tasks.delete(key);
    }

    public start(): void {
        if (this.started) {
            throw Error("cron already started");
        }
        this.started = true;
        void this.runTasks();
    }

    public stop(): void {
        if (!this.started) {
            throw Error("cron not stared");
        }
        this.started = false;
    }

    private async runTasks(): Promise<void> {
        const promises: Array<Promise<void>> = [];

        for (const [key, task] of this.tasks) {
            const lastExecution = this.lastExecution.get(key) ?? new DateTime(0);
            const minInterval = this.minInterval.get(key) ?? 0;
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
