import type { CallbackWithoutResultAndOptionalError, Model, Schema } from "mongoose";
import { set, pluralize, connect, disconnect, model } from "mongoose";
import type { IEstimateRequest } from "../entities/swap.js";
import { PreciseNumber } from "./number.js";

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

export const estimateValidator = function(this: ValidatorThis & IEstimateRequest, next: CallbackWithoutResultAndOptionalError): void {
    if (this.input.percentage != null) {
        this.invalidate("input", "cannot specify an input percentage");
    }

    if (this.input.amount?.lt(0) ?? false) {
        this.invalidate("input", "input amount cannot be less than 0");
    }

    if (this.output.some(x => x.percentage?.lt(0) ?? false)) {
        this.invalidate("output", "no single percentage can be less than 0");
    }

    if (this.output.some(x => x.amount?.lte(0) ?? false)) {
        this.invalidate("output", "no single amount can be less than 0");
    }

    if (this.input.amount == null) {
        if (this.output.some(x => x.percentage != null)) {
            this.invalidate("output", "cannot specify a percentage without an input amount");
        }

        if (this.output.some(x => x.amount == null)) {
            this.invalidate("output", "need to specify either an input or output amount");
        }
    } else {
        const percentage = this.output.reduce((prev, current) => prev.plus(current.percentage ?? 0), new PreciseNumber(0));
        if (!percentage.eq(1)) {
            this.invalidate("output", "percentages must sum to 1");
        }
        if (this.output.some(x => x.amount != null)) {
            this.invalidate("output", "cannot specify both in input and output amount");
        }
    }

    next();
};
