import { Connection, Keypair } from "@solana/web3.js";
import { spawn } from "child_process";
import { clearLine, cursorTo } from "readline";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { readFileSync } from "fs";

const port = "8899";
export const connection = new Connection(`http://127.0.0.1:${port}`);
export let killTestValidator: () => void = () => { /* Empty */ };

const logger = (data: string): void => {
    clearLine(process.stdout, 0);
    cursorTo(process.stdout, 0);
    process.stdout.write(data);
};

const waitForRPC = async (): Promise<void> => {
    let genesis = "";
    let counter = 0;
    while (genesis === "" && counter < 10) {
        logger(`Waiting for RPC${".".repeat(counter + 1)}`);
        try {
            genesis = await connection.getGenesisHash();
        } catch { /* Empty */ }
        await new Promise<void>(x => { setTimeout(x, 3000); });
        counter += 1;
    }
    logger("");
    if (genesis === "") {
        throw new Error("RPC not available within 30 seconds");
    }
};

const programId = (): string => {
    const currentFile = fileURLToPath(import.meta.url);
    const currentDir = dirname(currentFile);
    const keyPath = resolve(currentDir, "../target/deploy/jewl-keypair.json");
    const secretKeyString = readFileSync(keyPath, { encoding: "utf8" });
    const secertKeyJson = JSON.parse(secretKeyString) as Array<number>;
    const secretKey = Uint8Array.from(secertKeyJson);
    return Keypair.fromSecretKey(secretKey).publicKey.toBase58();
};

export const spawnTestValidator = async (): Promise<void> => {
    const args = ["--bpf-program", programId(), "target/deploy/jewl.so", "--rpc-port", port, "--reset"];
    const validator = spawn("solana-test-validator", args);
    killTestValidator = validator.kill.bind(validator);

    await waitForRPC();

    // TODO: Fund accounts

    // TODO: Create spl token mint
};


