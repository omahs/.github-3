import { associatedTokenAccount, vaultAccount } from "../../core/instruction";
import { Vault } from "../../core/vault";
import { linkAddress } from "../link";
import { programId, connection, payer } from "../validator";

const vaultData = await Vault.load(programId, connection);

console.info("account", linkAddress(vaultAccount(payer.publicKey)));
console.info("---------------------------------------------------------------");
for (const [_, mint] of vaultData.tokens.entries()) {
    const account = associatedTokenAccount(payer.publicKey, mint);
    const info = await connection.getAccountInfo(account);
    let amount = "        ";
    if (info != null) {
        const balance = await connection.getTokenAccountBalance(account);
        amount = balance.value.uiAmount?.toPrecision(3).padStart(8, " ") ?? " unknown";
    }
    console.info("| ", linkAddress(account), " | ", amount, " |");
}
console.info("---------------------------------------------------------------");

