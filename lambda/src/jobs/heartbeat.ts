import fetch from "node-fetch";

export const heartbeatJob = async (): Promise<void> => {
    const url = process.env.UPTIME_URL ?? "";
    if (url === "") { throw new Error("no uptime url"); }
    await fetch(url);
};