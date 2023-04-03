import { linkAddress, linkTransaction } from "../link";
import { select } from "../token";
import prompt from "prompts";
import { Transaction, sendAndConfirmTransaction } from "@solana/web3.js";
import { burn } from "../../core/instruction";
import { Vault } from "../../core/vault";
import { programId, connection, payer } from "../validator";

const vault = await Vault.load(programId, connection);
const token = await select();

const response = await prompt({
    type: "number",
    name: "amount",
    message: `Enter the amount of ${linkAddress(token.oracle)} to burn`,
    initial: 1
}) as { amount: number };

const transaction = new Transaction();
transaction.add(burn(programId, payer.publicKey, token.mint, vault.oracle, token.oracle, response.amount));
const hash = await sendAndConfirmTransaction(connection, transaction, [payer]);
console.info();
console.info("Burned", response.amount.toPrecision(3), linkAddress(token.oracle), "in transaction", linkTransaction(hash));
