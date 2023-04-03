import type { PythCluster } from "@pythnetwork/client";
import { PythHttpClient, getPythProgramKeyForCluster } from "@pythnetwork/client";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { vaultAccount } from "../../core/instruction";
import { Vault } from "../../core/vault";
import { linkAddress } from "../link";
import { programId, connection, cluster } from "../validator";

const pythProgram = getPythProgramKeyForCluster(cluster as PythCluster);
const pyth = new PythHttpClient(connection, pythProgram);
const pythData = await pyth.getData();
const symbolMap = new Map(pythData.products.map(x => [x.price_account, x]));
const solPrice = pythData.productPrice.get("Crypto.SOL/USD")?.price ?? 0;
const vaultData = await Vault.load(programId, connection);
let marketValue = 1e-9;

console.info();
console.info("Vault", linkAddress(vaultAccount(programId)));
console.info();
console.info("| Security         | Price            | Supply           | Value (SOL)      |");
console.info("-----------------------------------------------------------------------------");
for (const [oracle, mint] of vaultData.tokens.entries()) {
    const mintInfo = await connection.getTokenSupply(mint);
    const supply = mintInfo.value.uiAmount ?? 0;
    const product = symbolMap.get(oracle.toBase58());
    const symbol = product?.base ?? "unkown";
    const pythInfo = pythData.productPrice.get(product?.symbol ?? "");
    const price = pythInfo?.price ?? pythInfo?.previousPrice ?? 0;
    const value = price * supply / solPrice;
    const items = [
        symbol.padEnd(16, " "),
        price.toPrecision(8).padEnd(16, " "),
        supply.toPrecision(8).padEnd(16, " "),
        value.toPrecision(8).padEnd(16, " ")
    ].join(" | ");
    console.info("|", items, "|");
    marketValue += value;
}
console.info("-----------------------------------------------------------------------------");

const lamports = vaultData.lamports / LAMPORTS_PER_SOL;
const bookToMarket = (lamports / marketValue).toPrecision(8).padEnd(52, " ");
console.info("| book-to-market ratio", bookToMarket, "|");
