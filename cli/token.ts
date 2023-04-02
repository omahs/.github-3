import prompt from "prompts";
import { PublicKey } from "@solana/web3.js";
import { createMint } from "@solana/spl-token";
import { link } from "./link";
import { cluster, connection, payer, programId } from "./validator";
import { decimals, vaultAccount } from "../core/instruction";
import { Vault } from "../core/vault";

interface TokenPair {
    mint: PublicKey;
    oracle: PublicKey;
}

export const createNew = async (): Promise<TokenPair> => {

    let url = "";
    switch (cluster) {
        case "devnet": url = "https://pyth.network/developers/price-feed-ids#solana-devnet"; break;
        case "testnet": url = "https://pyth.network/developers/price-feed-ids#solana-testnet"; break;
        case "mainnet-beta": url = "https://pyth.network/developers/price-feed-ids#solana-mainnet-beta"; break;
        default: throw new Error("Invalid cluster");
    }

    const pythLink = link("Pyth oracle address", url);

    const response = await prompt({
        type: "text",
        name: "oracle",
        message: `Enter the ${pythLink} for the token you want to create`,
        initial: "CqFJLrT4rSpA46RQkVYWn8tdBDuQ7p7RXcp6Um76oaph"
    }) as { oracle: string };

    const oracle = new PublicKey(response.oracle);

    const mint = await createMint(
        connection,
        payer,
        vaultAccount(programId),
        vaultAccount(programId),
        decimals
    );

    return { mint, oracle };
};


export const select = async (): Promise<TokenPair> => {
    const vaultData = await Vault.load(programId, connection);

    if (vaultData.tokens.size === 0) { throw new Error("No tokens to select"); }

    const choices = Array.from(vaultData.tokens).map(([oracle, mint]) => {
        return { title: oracle.toBase58(), value: { oracle, mint } };
    });

    const response = await prompt({
        type: "select",
        name: "token",
        message: "Select a token",
        choices
    }) as { token: TokenPair };

    return response.token;
};
