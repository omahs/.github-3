
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

interface IProps {
    src: string;
    onError?: (event: { target: IProps }) => void;
}

export const cryptoIcon = (coin: string, style = "black"): object => {
    const src = `https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons/svg/${style}/${coin}.svg`
        .toLowerCase();
    const fallback = `https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons/svg/${style}/generic.svg`
        .toLowerCase();
    return {
        src,
        onError(event: { target: IProps }): void {
            event.target.onError = undefined;
            event.target.src = fallback;
        }
    };
};
