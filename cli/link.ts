import { cluster } from "./validator";
import type { PublicKey } from "@solana/web3.js";

const clusterQuery = (): string => {
    if (cluster === "mainnet-beta") { return ""; }
    return `?cluster=${cluster}`;
};

export const link = (str: string, url: string): string => {
    return `\u{1b}]8;;${url}\u{7}${str}\u{1b}]8;;\u{7}`;
};

export const linkTransaction = (hash: string): string => {
    return link(hash, `https://explorer.solana.com/tx/${hash}${clusterQuery()}`);
};

export const linkAddress = (key: PublicKey): string => {
    const address = key.toBase58();
    return link(address, `https://explorer.solana.com/address/${address}${clusterQuery()}`);
};
