import type { CronJob } from "cron";
import { job, time } from "cron";
import chalk from "chalk";
import { Cron, DateTime } from "jewl-core";
import { apiClient } from "./network.js";

const runTask = async (key: string, task: () => Promise<void>): Promise<void> => {
    const startTime = new Date();
    const formattedStartTime = `${startTime.toLocaleDateString()} ${startTime.toLocaleTimeString()}`;
    console.info(
        chalk.bgBlue.bold(" CRON "),
        chalk.dim(formattedStartTime),
        chalk.cyan(`Started cron job ${key}`)
    );
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
    const formattedEndTime = `${endTime.toLocaleDateString()} ${endTime.toLocaleTimeString()}`;
    console.info(
        chalk.bgBlue.bold(" CRON "),
        chalk.dim(formattedEndTime),
        chalk[success ? "green" : "red"](`Finished ${key} in ${duration} ms`)
    );
};

const runTasks = async (cron: string, tasks: Record<string, () => Promise<void>>): Promise<void> => {
    try {
        await apiClient.ping();
    } catch {
        const date = new Date();
        const formattedTime = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
        console.info(
            chalk.bgBlue.bold(" CRON "),
            chalk.dim(formattedTime),
            `Skipping ${cron} because server is in maintainance mode`
        );
        return;
    }

    const promises: Array<Promise<void>> = [];
    for (const key in tasks) {
        const promise = async (): Promise<void> => {
            const storedCron = await Cron.findOne({ cron, key }) ?? new Cron({ cron, key, notBefore: new DateTime(0) });
            if (storedCron.notBefore.lt(new DateTime()) || process.env.DEBUG === "true") {
                await runTask(key, tasks[key]);
                const schedule = time(cron);
                storedCron.notBefore = new DateTime(schedule.sendAt().toUnixInteger());
                await storedCron.save();
            }
        };
        promises.push(promise());
    }
    await Promise.all(promises);
};

export const scheduleTasks = (cron: string, tasks: Record<string, () => Promise<void>>): CronJob => {
    return job(cron, () => void runTasks(cron, tasks), null, true, "Europe/Amsterdam", null, true);
};
