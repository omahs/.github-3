import { readdirSync, statSync } from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { writeResults } from "./check";

export const startTestRunner = async (): Promise<void> => {
    const currentFile = fileURLToPath(import.meta.url);
    const currentDir = dirname(currentFile);

    const modules = readdirSync(currentDir).filter(file => {
        const absolute = `${currentDir}/${file}`;
        return statSync(absolute).isDirectory();
    });

    const testFiles = modules.flatMap(module => {
        const absolute = `${currentDir}/${module}`;
        return readdirSync(absolute)
            .filter(file => file.endsWith(".ts") || file.endsWith(".tsx"))
            .map(file => file.split(".").slice(0, -1).join("."))
            .map(file => `./${module}/${file}`);
    });

    for (const testFile of testFiles) {
        const testName = testFile.split("/").slice(-2).join(" ");
        console.info(`- ${testName}`);
        await import(testFile);
    }

    writeResults();
};
