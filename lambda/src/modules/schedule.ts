import chalk from "chalk";
import { DateTime, ServerStatus } from "jewl-core";
import { nanoid } from "nanoid";
import { apiClient } from "./network.js";

const isInMaintainanceMode = async (): Promise<boolean> => {
    if (process.env.DEBUG === "true") { return false; }
    try {
        const response = await apiClient.getStatus();
        if (response.status === ServerStatus.up) { return false; }
    } catch { /* Empty */ }
    return true;
};

let lastStatus: [string, boolean] = ["", false];
const lazyIsInMaintainanceMode = async (key: string): Promise<boolean> => {
    if (lastStatus[0] === key) { return Promise.resolve(lastStatus[1]); }
    const result = await isInMaintainanceMode();
    // eslint-disable-next-line require-atomic-updates
    lastStatus = [key, result];
    return result;
};

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
        if (process.env.DEBUG === "true") {
            console.error(err);
        }
    }
    const endTime = new Date();
    const duration = endTime.getTime() - startTime.getTime();
    optionalLog(chalk[success ? "green" : "red"](`Finished ${key} in ${duration} ms`));
};

export class Cron {
    private readonly tasks = new Map<string, () => Promise<void>>();
    private readonly isSecure = new Map<string, boolean>();
    private readonly minInterval = new Map<string, number>();
    private readonly lastExecution = new Map<string, DateTime>();
    private started = false;

    public constructor(minInterval = 1) {
        const spacer = async (): Promise<void> => new Promise<void>(resolve => { setTimeout(resolve, minInterval * 1000); });
        this.tasks.set("", spacer);
    }

    public addTask(key: string, task: () => Promise<void>, secure = false, minInterval = 1): void {
        this.tasks.set(key, task);
        this.minInterval.set(key, minInterval);
        this.isSecure.set(key, secure);
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
        const maintainanceKey = nanoid();

        for (const [key, task] of this.tasks) {
            const lastExecution = this.lastExecution.get(key) ?? new DateTime(0);
            const minInterval = this.minInterval.get(key) ?? 0;
            if (lastExecution.addingSeconds(minInterval).gt(new DateTime())) { return; }
            const isSecure = this.isSecure.get(key) ?? false;
            if (isSecure && await lazyIsInMaintainanceMode(maintainanceKey)) { return; }
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
