
declare global {
    interface String {
        onlyNumber: () => string;
    }
}

String.prototype.onlyNumber = function(this: string): string {
    const allowed = new Set("0123456789.");
    let result = "";
    let decimal = false;
    for (const char of this) {
        if (!allowed.has(char)) { continue; }
        if (char === ".") {
            if (decimal) { continue; }
            decimal = true;
        }
        result = `${result}${char}`;
    }
    return result;
};

export { };
