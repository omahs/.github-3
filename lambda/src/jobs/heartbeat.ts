import fetch from "node-fetch";

/**
    This method calls the BetterUptime heartbeat url
    as fetched from the env variables.
**/
export const heartbeat = async (): Promise<void> => {
    const url = process.env.UPTIME_URL ?? "";
    if (url === "") { throw new Error("no uptime url"); }
    await fetch(url);
};
