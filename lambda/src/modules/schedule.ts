import type { CronJob } from "cron";
import { job, time } from "cron";
import chalk from "chalk";
import { Cron, DateTime, ServerStatus } from "jewl-core";
import { apiClient } from "./network.js";

const isInMaintainanceMode = async (): Promise<boolean> => {
    if (process.env.DEBUG === "true") { return false; }
    try {
        const response = await apiClient.getStatus();
        if (response.status === ServerStatus.normal) { return false; }
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

const runTask = async (key: string, task: () => Promise<void>): Promise<boolean> => {
    if (key !== "heartbeatJob" && await isInMaintainanceMode()) {
        log(`Skipping ${key} because server is in maintainance mode`);
        return false;
    }

    const startTime = new Date();
    log(chalk.cyan(`Started cron job ${key}`));
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
    log(chalk[success ? "green" : "red"](`Finished ${key} in ${duration} ms`));
    return success;
};

const runTasks = async (cron: string, tasks: Record<string, () => Promise<void>>): Promise<void> => {
    const promises: Array<Promise<void>> = [];
    for (const key in tasks) {
        const promise = async (): Promise<void> => {
            const storedCron = await Cron.findOne({ cron, key }) ?? new Cron({ cron, key, notBefore: new DateTime(0) });
            if (storedCron.notBefore.gt(new DateTime()) && process.env.DEBUG !== "true") { return; }
            const status = await runTask(key, tasks[key]);
            if (!status) { return; }
            const schedule = time(cron);
            storedCron.notBefore = new DateTime(schedule.sendAt().toUnixInteger()).addingSeconds(-5);
            await storedCron.save();
        };
        promises.push(promise());
    }
    await Promise.all(promises);
};

export const scheduleTasks = (cron: string, tasks: Record<string, () => Promise<void>>): CronJob => {
    return job(cron, () => void runTasks(cron, tasks), null, true, "Europe/Amsterdam", null, true);
};
