import type { PublicKey } from "@solana/web3.js";
import { Transaction, sendAndConfirmTransaction } from "@solana/web3.js";
import { Vault } from "../../core/vault";
import { connection, payer, programId } from "../validator";
import prompt from "prompts";
import { destroy } from "../../core/instruction";
import { linkAddress, linkTransaction } from "../link";

const vaultData = await Vault.load(programId, connection);

if (vaultData.tokens.size === 0) { throw new Error("No tokens to destroy"); }

const choices = Array.from(vaultData.tokens).map(([oracle, _]) => {
    return { title: oracle.toBase58(), value: oracle };
});

const response = await prompt({
    type: "select",
    name: "oracle",
    message: "Select a token to destroy",
    choices
}) as { oracle: PublicKey };

const transaction = new Transaction();
transaction.add(destroy(programId, payer.publicKey, response.oracle));
const hash = await sendAndConfirmTransaction(connection, transaction, [payer]);
console.info("Removed", linkAddress(response.oracle), "in transaction", linkTransaction(hash));
