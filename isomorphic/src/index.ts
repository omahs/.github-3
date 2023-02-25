/**
    The platform-specific functions that have been turned
    platform-agnostic. A default implemenation is provided
    that will throw an error. If a method is not implemented
    by either node or browser it falls back to the default
    implementation.
**/
interface Isomorphic {

    /**
        Fetch information from a remote url.
    **/
    fetch: (url: string, req: object) => Promise<object>;

    /**
        Compute a hmac signature for a message using the
        specified secret. The digest algorithm used is
        sha256.
    **/
    hmac: (message: Buffer, secret: Buffer) => Promise<Buffer>;

    /**
        Compute collision-resistant hash of a message.
        The digest algorithm used is sha256.
    **/
    hash: (message: Buffer) => Promise<Buffer>;
}

/**
    The platform-specific functions that have been turned
    platform-agnostic. A default implemenation is provided
    that will throw an error. If a method is not implemented
    by either node or browser it falls back to the default
    implementation.
**/
const isomorphic: Isomorphic = {

    /**
        The default implementation of the `fetch` method.
    **/
    fetch: async () => Promise.reject(new Error("not implemented")),

    /**
        The default implementation of the `hmac` method.
    **/
    hmac: async () => Promise.reject(new Error("not implemented")),

    /**
        The default implementation of the `hash` method.
    **/
    hash: async () => Promise.reject(new Error("not implemented"))
};

export default isomorphic;
