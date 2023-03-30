import { readdirSync } from "fs";
import { writeResults } from "./check";

export const startTestRunner = async (path: string): Promise<void> => {

    const testFiles = readdirSync(path)
        .filter(file => file.endsWith(".ts") || file.endsWith(".tsx"))
        .map(file => `${path}/${file}`);

    for (const testFile of testFiles) {
        const testName = testFile
            .split(".").slice(0, -1).join(".")
            .split("/").slice(-2).join(" ");
        console.info(`- ${testName}`);
        await import(testFile);
    }

    writeResults();
};
