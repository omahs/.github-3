import { sendAndConfirmTransaction, PublicKey, Transaction } from "@solana/web3.js";
import { initialize, vaultAccount } from "../../core/instruction";
import { linkAddress, linkTransaction } from "../link";
import { programId, payer, connection, cluster } from "../validator";

let solOracleString = "";
switch (cluster) {
    case "devnet": solOracleString = "J83w4HKfqxwcq3BEMMkPFSppX3gqekLyLJBexebFVkix"; break;
    case "testnet": solOracleString = "7VJsBtJzgTftYzEeooSDYyjKXvYRWJHdwvbwfBvTg9K"; break;
    case "mainnet-beta": solOracleString = "H6ARHf6YXhGYeQfUzQNGk6rDNnLBQKrenN712K4AQJEG"; break;
    default: throw new Error("Invalid cluster");
}
const solOracle = new PublicKey(solOracleString);

const transaction = new Transaction();
transaction.add(initialize(programId, payer.publicKey, solOracle));
const hash = await sendAndConfirmTransaction(connection, transaction, [payer]);
console.info("Initialized", linkAddress(vaultAccount(programId)), "in transaction", linkTransaction(hash));
