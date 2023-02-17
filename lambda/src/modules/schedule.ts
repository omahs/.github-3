import chalk from "chalk";
import { ServerStatus } from "jewl-core";
import { apiClient } from "./network.js";

const isInMaintainanceMode = async (): Promise<boolean> => {
    if (process.env.DEBUG === "true") { return false; }
    try {
        const response = await apiClient.getStatus();
        if (response.status === ServerStatus.up) { return false; }
    } catch { /* Empty */ }
    return true;
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
    private readonly modulo = new Map<string, number>();
    private iteration = 0;
    private started = false;

    public constructor(minInterval = 5) {
        const spacer = async (): Promise<void> => new Promise<void>(resolve => { setTimeout(resolve, minInterval * 1000); });
        this.tasks.set("", spacer);
    }

    public addTask(key: string, task: () => Promise<void>, secure = false, modulo = 1): void {
        this.tasks.set(key, task);
        this.modulo.set(key, modulo);
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

        const isMaintainance = await isInMaintainanceMode();

        this.tasks.forEach((task, key) => {
            const isSecure = this.isSecure.get(key) ?? false;
            if (isSecure && isMaintainance) { return; }
            const modulo = this.modulo.get(key) ?? 1;
            if (this.iteration % modulo !== 0) { return; }
            const promise = runTask(key, task);
            promises.push(promise);
        });

        await Promise.all(promises);

        this.iteration += 1;

        if (this.started) {
            void this.runTasks();
        }
    }
}
