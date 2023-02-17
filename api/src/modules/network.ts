import { UptimeClient } from "jewl-core";

const uptimeKey = process.env.UPTIME_KEY ?? "";
export const uptimeClient = new UptimeClient(uptimeKey);

