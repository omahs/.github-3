import fetch from "node-fetch";
import { parse } from "csv-parse";
import { Sanction, SanctionType } from "jewl-core";

/**
    The OFAC server url fetched from the env variables.
**/
const ofacUrl = process.env.OFAC_URL ?? "";

/**
    Download the OFAC SDN list, extract all the sanctioned crypto
    addresses and store them in the DB.
**/
export const ofac = async (): Promise<void> => {
    const response = await fetch(ofacUrl);
    if (response.body == null) { throw new Error("response is empty"); }
    const parser = parse({ delimiter: ",", skipRecordsWithError: true });
    response.body.pipe(parser);
    const regex = /Digital Currency Address - (?<currency>\S+) (?<address>\S+);/ug;
    for await (const record of parser) {
        const entries = record as Array<string>;
        if (entries.length < 12) { continue; }
        const matches = entries[11].matchAll(regex);
        for (const match of matches) {
            if (match.groups == null) { continue; }
            const query = { id: match.groups.address, sanction: SanctionType.OFAC };
            await Sanction.updateOne(query, { }, { upsert: true });
        }
    }
};
