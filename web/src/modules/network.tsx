import { CoinbasePublicClient, ApiClient } from "jewl-core";

export const apiClient = new ApiClient(process.env.REACT_APP_SERVER_URL ?? "");

const coinbaseUrl = process.env.REACT_APP_COINBASE_URL ?? "";
export const coinbaseClient = new CoinbasePublicClient(coinbaseUrl);
