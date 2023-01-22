import type { Model, Schema } from "mongoose";
import { set, pluralize, connect, disconnect, model } from "mongoose";

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
