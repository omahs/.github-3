import { vaultAccount } from "../../core/instruction";
import { Vault } from "../../core/vault";
import { linkAddress } from "../link";
import { programId, connection } from "../validator";

const vaultData = await Vault.load(programId, connection);
let marketValue = 1e-9;

console.info("vault", linkAddress(vaultAccount(programId)));
console.info("---------------------------------------------------------------");
for (const [oracle, mint] of vaultData.tokens.entries()) {
    const supply = await connection.getTokenSupply(mint);
    const amount = supply.value.uiAmount?.toPrecision(3).padStart(8, " ") ?? " unknown";
    console.info("| ", linkAddress(oracle), " | ", amount, " |");
    marketValue += 0; // TODO <- get from pyth
}
console.info("---------------------------------------------------------------");

const bookToMarket = vaultData.lamports / marketValue;
console.info("book-to-market ratio", bookToMarket.toPrecision(3));
