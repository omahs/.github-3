import BigNumber from "bignumber.js";

export class PreciseNumber extends BigNumber {
    public override valueOf(): string {
        return this.toString();
    }

    public override toJSON(): string {
        return this.toString();
    }
}

export const PreciseNumberSchema = {
    type: String,
    get: (x?: string): PreciseNumber | undefined => x == null ? undefined : new PreciseNumber(x),
    set: (x: PreciseNumber): string => x.toString()
};
