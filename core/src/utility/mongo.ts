import type { Model, Schema } from "mongoose";
import { set, pluralize, connect, disconnect, model } from "mongoose";
import type { CallbackWithoutResultAndOptionalError } from "mongoose";
import { PreciseNumber } from "./number.js";
import type { OrderPeriod } from "../entities/payment.js";

if (typeof window === "undefined") {
    set("strictQuery", false);
    pluralize(null);
}

export const mongoConnect = async (url: string): Promise<void> => {
    await connect(url);
};

export const mongoDisconnect = async (): Promise<void> => {
    await disconnect();
};

export const createModel = <T>(schema: Schema, name?: string): Model<T> => {
    return model(name ?? "ephemeral", schema, undefined, { overwriteModels: name == null }) as Model<T>;
};

export const validate = async <T>(Schema: Model<T>, json: object): Promise<T> => {
    const schema = new Schema(json);
    return new Promise<T>((resolve, reject) => {
        schema.validate(err => {
            if (err == null) {
                resolve(schema);
            } else {
                reject(err);
            }
        });
    });
};

interface ValidatorThis {
    invalidate: (field: string, reason: string) => void;
}

interface AllocationValidatorThis extends ValidatorThis {
    addresses: Record<string, string>;
    allocation: Record<string, PreciseNumber>;
}

export const allocationValidator = function(this: AllocationValidatorThis, next: CallbackWithoutResultAndOptionalError): void {
    if (Object.keys(this.allocation).length < 1) { this.invalidate("allocation", "empty allocation"); }
    for (const key in this.allocation) {
        if (this.addresses[key] === null) {
            this.invalidate("addresses", `address for ${key} missing`);
        }
    }
    next();
};

interface AmountValidatorThis extends ValidatorThis {
    amount: PreciseNumber;
    installments: number;
    period: OrderPeriod;
}

export const amountValidator = function(this: AmountValidatorThis, next: CallbackWithoutResultAndOptionalError): void {
    const totalTerm = new PreciseNumber(this.installments).multipliedBy(this.period);
    const multiplier = new PreciseNumber(356).div(totalTerm);
    const yearlyEquivalent = this.amount.div(multiplier);
    if (yearlyEquivalent.gte(1e5)) {
        this.invalidate("amount", "maximum amount of 100k per year exceeded");
    }
    next();
};
