import { Transaction, TransactionInstruction, sendAndConfirmTransaction } from "@solana/web3.js";
import { connection, programId, payer } from "../validator";

console.log("Mint");

const instruction = new TransactionInstruction({
    keys: [{ pubkey: programId, isSigner: false, isWritable: true }],
    programId,
    data: Buffer.alloc(0) // All instructions are hellos
});

await sendAndConfirmTransaction(
    connection,
    new Transaction().add(instruction),
    [payer]
);
