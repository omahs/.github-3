import { Transaction, sendAndConfirmTransaction } from "@solana/web3.js";
import { connection, payer, programId } from "../validator";
import { destroy } from "../../core/instruction";
import { linkAddress, linkTransaction } from "../link";
import { select } from "../token";

const token = await select();

const transaction = new Transaction();
transaction.add(destroy(programId, payer.publicKey, token.oracle));
const hash = await sendAndConfirmTransaction(connection, transaction, [payer]);
console.info("Removed", linkAddress(token.oracle), "in transaction", linkTransaction(hash));
