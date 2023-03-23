import { Connection } from "@solana/web3.js";
import { spawn } from "child_process";
import { clearLine, cursorTo } from "readline";

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
        await new Promise<void>(resolve => { setTimeout(resolve, 3000); });
        counter += 1;
    }
    logger("");
    if (genesis === "") {
        throw new Error("RPC not available within 30 seconds");
    }
};

export const spawnTestValidator = async (): Promise<void> => {
    const args = ["--bpf-program", "Bnmcdu74FKGReWt9149UC9QxfkLQpf4tGZdoYzzGM83H", "dist/jewl.so", "--rpc-port", port, "--reset"];
    const validator = spawn("solana-test-validator", args);
    killTestValidator = validator.kill.bind(validator);

    await waitForRPC();

    // TODO: Fund accounts
};


