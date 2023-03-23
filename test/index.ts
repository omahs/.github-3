import { allChecksPassed } from "./check";
import "./env";
import { startTestRunner } from "./runner";
import { killTestValidator, spawnTestValidator } from "./validator";

const onExit = (exitCode = 2): void => {
    killTestValidator();
    process.exit(exitCode);
};

process.on("SIGINT", onExit);
process.on("SIGQUIT", onExit);
process.on("SIGTERM", onExit);

try {
    await spawnTestValidator();
    await startTestRunner();
    const exitCode = allChecksPassed() ? 0 : 1;
    onExit(exitCode);
} catch (error) {
    console.error(error);
    onExit();
}
