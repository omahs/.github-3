import fetch from "node-fetch";
import { parse } from "csv-parse";
import { Sanction, SanctionType } from "jewl-core";

/**
    The ITA server url fetched from the env variables.
**/
const itaUrl = process.env.ITA_URL ?? "";

/**
    The OFAC server url fetched from the env variables.
**/
const ofacUrl = process.env.OFAC_URL ?? "";

/**
    Download a US Gov list, extract all the sanctioned crypto
    addresses and store them in the DB.
**/
const fetchAndExtractCrypto = async (url: string, index: number, sanction: SanctionType): Promise<void> => {
    const response = await fetch(url);
    if (response.body == null) { throw new Error("response is empty"); }
    const parser = parse({ delimiter: ",", skipRecordsWithError: true });
    response.body.pipe(parser);
    const regex = /Digital Currency Address - (?<currency>\S+),? (?<address>\S+)/ug;
    for await (const record of parser) {
        const entries = record as Array<string>;
        if (entries.length < index + 1) { continue; }
        const matches = entries[index].matchAll(regex);
        for (const match of matches) {
            if (match.groups == null) { continue; }
            const query = { id: match.groups.address, sanction };
            await Sanction.updateOne(query, { }, { upsert: true });
        }
    }
};

/**
    Download the OFAC SDN list, extract all the sanctioned crypto
    addresses and store them in the DB.
**/
export const ofac = async (): Promise<void> => {
    return fetchAndExtractCrypto(ofacUrl, 11, SanctionType.OFAC);
};

/**
    Download the ITA CSL list, extract all the sanctioned crypto
    addresses and store them in the DB.
**/
export const ita = async (): Promise<void> => {
    return fetchAndExtractCrypto(itaUrl, 28, SanctionType.ITA);
};

