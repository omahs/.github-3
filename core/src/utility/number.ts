import BigNumber from "bignumber.js";

export class PreciseNumber extends BigNumber { }

export const PreciseNumberSchema = {
    type: String,
    get: (x?: string): PreciseNumber | undefined => x == null ? undefined : new PreciseNumber(x),
    set: (x: PreciseNumber): string => x.toString(10)
};
