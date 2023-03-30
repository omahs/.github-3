import { allChecksPassed } from "../core/test/check";
import { startTestRunner } from "../core/test/runner";
import { killTestValidator, spawnTestValidator } from "./validator";
import { dirname } from "path";
import { fileURLToPath } from "url";

const onExit = (exitCode = 2): void => {
    killTestValidator();
    process.exit(exitCode);
};

process.on("SIGINT", onExit);
process.on("SIGQUIT", onExit);
process.on("SIGTERM", onExit);

try {
    await spawnTestValidator();
    const currentFile = fileURLToPath(import.meta.url);
    const currentDir = dirname(currentFile);
    await startTestRunner(`${currentDir}/suite`);
    const exitCode = allChecksPassed() ? 0 : 1;
    onExit(exitCode);
} catch (error) {
    console.error(error);
    onExit();
}
