import prompt from "prompts";
import { PublicKey } from "@solana/web3.js";
import { createMint } from "@solana/spl-token";
import { link } from "./link";
import { cluster, connection, payer, programId } from "./validator";
import { vaultAccount } from "../core/instruction";

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
        9
    );

    return { mint, oracle };
};
