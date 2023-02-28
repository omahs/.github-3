
/**
    A custom Mongoose validator that checks if the supplied url is a valid url.
**/
const validator = {
    validator: (url: URL): boolean => {
        try {
            const _ = new URL(url);
            return true;
        } catch {
            return false;
        }
    },
    message: (props: { value: string }): string => `${props.value} is not a valid url`
};

/**
    A custom Mongoose schema for validating URL types. This schema can
    be use like `ulr: URLSchema` or `url: { ...URLSchema, otherProperties: true }`.
**/
export const URLSchema = {
    type: String,
    get: (x: string): URL => new URL(x),
    set: (x: URL): string => x.toString(),
    validate: validator
};
