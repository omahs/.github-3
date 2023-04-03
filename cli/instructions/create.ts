import { sendAndConfirmTransaction, Transaction } from "@solana/web3.js";
import { create } from "../../core/instruction";
import { linkAddress, linkTransaction } from "../link";
import { createNew } from "../token";
import { programId, payer, connection } from "../validator";

const token = await createNew();

const transaction = new Transaction();
transaction.add(create(programId, payer.publicKey, token.oracle, token.mint));
const hash = await sendAndConfirmTransaction(connection, transaction, [payer]);
console.info();
console.info("Added", linkAddress(token.oracle), "->", linkAddress(token.mint), "in transaction", linkTransaction(hash));
