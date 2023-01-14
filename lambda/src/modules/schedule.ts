import { schedule } from "node-cron";
import chalk from "chalk";

const runJobs = async (jobs: Record<string, () => Promise<void>>): Promise<void> => {
    for (const key in jobs) {
        const startTime = new Date();
        const formattedStartTime = `${startTime.toLocaleDateString()} ${startTime.toLocaleTimeString()}`;
        console.info(
            chalk.bgBlue.bold(" CRON "),
            chalk.dim(formattedStartTime),
            chalk.cyan(`Started cron job ${key}`)
        );
        let success = false;
        try {
            await jobs[key]();
            success = true;
        } catch (err) {
            let name = "Unknown Error";
            if (err instanceof Error) { name = err.name; }
            console.error(chalk.bgRed.bold(" ERROR "), name);
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
    }
};

export const scheduleJobs = (cron: string, jobs: Record<string, () => Promise<void>>): void => {
    schedule(cron, () => void runJobs(jobs));
    void runJobs(jobs);
    // TODO: <- needs to know when the last cron was run?
};
