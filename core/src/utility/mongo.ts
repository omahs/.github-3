import type { Model, Schema } from "mongoose";
import { set, pluralize, connect, disconnect, model } from "mongoose";

/**
    Set mongoose validation to strict mode and do not pluralized
    table names. This is only executed on non-browser platforms as
    mongoose does not support this in browsers.
**/
if (typeof window === "undefined") {
    set("strictQuery", false);
    pluralize(null);
}

/**
    A method for connecting to a MongoDB instance using the url.
    You can only connect to a single MongoDB instance at once.
**/
export const mongoConnect = async (url: string): Promise<void> => {
    await connect(url);
};

/**
    A method for disconnecting from the currently connected
    MongoDB instance.
**/
export const mongoDisconnect = async (): Promise<void> => {
    await disconnect();
};

/**
    Helper function for creating a model if no model name is specified
    the model will become ephemeral and should only be used for validation.
**/
export const createModel = <T>(schema: Schema, name?: string): Model<T> => {
    const definition = model(name ?? "ephemeral", schema, undefined, { overwriteModels: name == null }) as Model<T>;
    if (typeof window !== "undefined") {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        definition.schema = schema;
    }
    return definition;
};

/**
    Helper function to validate an object based on a Model. This method
    automatically casts the object to the model if the validation
    succeeds.
**/
export const validate = async <T>(Schema: Model<T>, json: object): Promise<T> => {
    const schema = new Schema(json);
    console.log(json);
    await schema.validate();
    return schema;
};
