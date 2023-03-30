import { resolve, dirname } from "path";
import { Keypair, Connection } from "@solana/web3.js";
import { fileURLToPath } from "url";
import { readFileSync } from "fs";
import { homedir } from "os";
import YAML from "yaml";

const currentFile = fileURLToPath(import.meta.url);
const currentDir = dirname(currentFile);
const programKeyPath = resolve(currentDir, "../target/deploy/jewl-keypair.json");
const programKeyString = readFileSync(programKeyPath, { encoding: "utf8" });
const programKeyJSON = JSON.parse(programKeyString) as Array<number>;
const programKeyArr = Uint8Array.from(programKeyJSON);
export const programId = Keypair.fromSecretKey(programKeyArr).publicKey;

const configFile = resolve(homedir(), ".config", "solana", "cli", "config.yml");
const configYml = readFileSync(configFile, { encoding: "utf8" });
const config = YAML.parse(configYml) as { json_rpc_url: string, keypair_path: string };

const rpcURL = config.json_rpc_url;
export const connection = new Connection(rpcURL);

const payerKeyString = readFileSync(config.keypair_path, { encoding: "utf8" });
const payerKeyJSON = JSON.parse(payerKeyString) as Array<number>;
const payerKeyArr = Uint8Array.from(payerKeyJSON);
export const payer = Keypair.fromSecretKey(payerKeyArr);
