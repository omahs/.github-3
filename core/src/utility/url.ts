
/**
    A custom Mongoose schema for validating URL types. This schema can
    be use like `ulr: URLSchema` or `url: { ...URLSchema, otherProperties: true }`.
**/
export const URLSchema = {
    type: String,
    get: (x: string): URL => new URL(x),
    set: (x: URL): string => x.toString()
};
