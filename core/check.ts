import chalk from "chalk";

const checks: Array<boolean> = [];

const logCheck = (message: string, condition: boolean): void => {
    const symbol = condition ? chalk.green("✓") : chalk.red("✗");
    console.info(` [${symbol}] ${message}`);
    checks.push(condition);
};

export const check = (message: string, condition: boolean): void => {
    logCheck(message, condition);
};

export const checkThrows = (message: string, condition: () => void): void => {
    try {
        condition();
        logCheck(message, false);
    } catch {
        logCheck(message, true);
    }
};

export const checkNotThrows = (message: string, condition: () => void): void => {
    try {
        condition();
        logCheck(message, true);
    } catch {
        logCheck(message, false);
    }
};

export const writeResults = (): void => {
    const succeeded = checks.reduce((x, y) => x + Number(y), 0);
    console.info(`${succeeded}/${checks.length} checks passed`);
};

export const allChecksPassed = (): boolean => {
    return checks.every(x => x);
};
