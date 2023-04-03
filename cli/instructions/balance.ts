import type { PythCluster } from "@pythnetwork/client";
import { getPythProgramKeyForCluster, PythHttpClient } from "@pythnetwork/client";
import { associatedTokenAccount } from "../../core/instruction";
import { Vault } from "../../core/vault";
import { linkAddress } from "../link";
import { programId, connection, payer, cluster } from "../validator";

const pythProgram = getPythProgramKeyForCluster(cluster as PythCluster);
const pyth = new PythHttpClient(connection, pythProgram);
const pythData = await pyth.getData();
const symbolMap = new Map(pythData.products.map(x => [x.price_account, x]));
const solPrice = pythData.productPrice.get("Crypto.SOL/USD")?.price ?? 0;
const vaultData = await Vault.load(programId, connection);
let marketValue = 0;

console.info();
console.info("Account", linkAddress(payer.publicKey));
console.info();
console.info("| Security         | Price            | Amount           | Value (SOL)      |");
console.info("-----------------------------------------------------------------------------");
for (const [oracle, mint] of vaultData.tokens.entries()) {
    const account = associatedTokenAccount(payer.publicKey, mint);
    const accountInfo = await connection.getAccountInfo(account);
    if (accountInfo == null) { continue; }
    const balance = await connection.getTokenAccountBalance(account);
    const amount = balance.value.uiAmount ?? 0;
    const product = symbolMap.get(oracle.toBase58());
    const symbol = product?.base ?? "unkown";
    const pythInfo = pythData.productPrice.get(product?.symbol ?? "");
    const price = pythInfo?.price ?? pythInfo?.previousPrice ?? 0;
    const value = price * amount / solPrice;
    const items = [
        symbol.padEnd(16, " "),
        price.toPrecision(8).padEnd(16, " "),
        amount.toPrecision(8).padEnd(16, " "),
        value.toPrecision(8).padEnd(16, " ")
    ].join(" | ");
    console.info("|", items, "|");
    marketValue += value;
}
console.info("-----------------------------------------------------------------------------");
console.info("|", "Portfolio value (SOL)", marketValue.toPrecision(8).padEnd(51, " "), "|");

