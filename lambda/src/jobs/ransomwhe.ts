import fetch from "node-fetch";
import { Sanction, SanctionType } from "jewl-core";

/**
    The ransomwhe.re server url fetched from the env variables.
**/
const ransomwheUrl = process.env.RANSOMWHE_URL ?? "";

/**
    Download the ransomwhe.re list, extract all the crypto
    addresses and store them in the DB.
**/
export const ransomwhe = async (): Promise<void> => {
    const response = await fetch(ransomwheUrl);
    const body = await response.json() as { result: Array<object> };

    for (const record of body.result) {
        if (!Object.hasOwn(record, "address")) { continue; }
        const item = record as { address: string };
        const query = { id: item.address, sanction: SanctionType.Randomwhe };
        await Sanction.updateOne(query, { }, { upsert: true });
    }
};
