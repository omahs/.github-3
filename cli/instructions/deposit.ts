import prompt from "prompts";
import { deposit } from "../../core/instruction";
import { Transaction, sendAndConfirmTransaction } from "@solana/web3.js";
import { linkTransaction } from "../link";
import { programId, payer, connection } from "../validator";

const response = await prompt({
    type: "number",
    name: "amount",
    message: "Enter the amount of SOL to deposit",
    initial: 1
}) as { amount: number };

const transaction = new Transaction();
transaction.add(deposit(programId, payer.publicKey, response.amount));
const hash = await sendAndConfirmTransaction(connection, transaction, [payer]);
console.info();
console.info("Deposited", response.amount.toPrecision(3), "SOL in transaction", linkTransaction(hash));
