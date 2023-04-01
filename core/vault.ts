import { PublicKey } from "@solana/web3.js";
import type { AccountInfo, Connection } from "@solana/web3.js";
import { vaultAccount } from "./instruction";

export class Vault {
    public readonly owner: PublicKey;
    public readonly authority: PublicKey;
    public readonly oracle: PublicKey;
    public readonly tokens: Map<PublicKey, PublicKey>;
    public readonly lamports: number;

    private constructor(info: AccountInfo<Buffer>) {
        this.owner = info.owner;
        this.authority = new PublicKey(info.data.subarray(0, 32));
        this.oracle = new PublicKey(info.data.subarray(32, 64));
        this.lamports = info.lamports;
        this.tokens = new Map();
        for (let i = 64; i < info.data.length; i += 64) {
            const key = new PublicKey(info.data.subarray(i, i + 32));
            const value = new PublicKey(info.data.subarray(i + 32, i + 64));
            if (key.equals(PublicKey.default)) { break; }
            if (value.equals(PublicKey.default)) { break; }
            this.tokens.set(key, value);
        }
    }

    public static async load(programId: PublicKey, connection: Connection): Promise<Vault> {
        const data = await connection.getAccountInfo(vaultAccount(programId));
        if (data == null) { throw new Error("Vault account not found"); }
        return new Vault(data);
    }
}
