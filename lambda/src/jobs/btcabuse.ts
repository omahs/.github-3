import fetch from "node-fetch";
import { parse } from "csv-parse";
import { Sanction, SanctionType } from "jewl-core";

/**
    The BitcoinAbuse server url fetched from the env variables.
**/
const btcabuseUrl = process.env.BTCABUSE_URL ?? "";

/**
    This method calls exports all reports from
    `bitcoinabuse.com` and stores them in the db.
**/
export const btcabuse = async (): Promise<void> => {
    const response = await fetch(btcabuseUrl);
    if (response.body == null) { throw new Error("response is empty"); }
    const parser = parse({ delimiter: ",", from: 2, skipRecordsWithError: true });
    response.body.pipe(parser);
    for await (const record of parser) {
        const entries = record as Array<string>;
        if (entries.length < 3) { continue; }
        const query = { id: entries[1], sanction: SanctionType.BitcoinAbuse };
        await Sanction.updateOne(query, { }, { upsert: true });
    }
};
