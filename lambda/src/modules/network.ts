import { ApiClient, BinanceClient } from "jewl-core";

const serverUrl = process.env.SERVER_URL ?? "";
export const apiClient = new ApiClient(serverUrl);

const binanceKey = process.env.BINANCE_KEY ?? "";
const binanceSecret = process.env.BINANCE_SECRET ?? "";
export const binanceClient = new BinanceClient(binanceKey, binanceSecret);
