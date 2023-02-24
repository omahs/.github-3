
interface Isomorphic {
    fetch: (url: string, req: object) => Promise<object>;
    hmac: (message: Buffer, secret: Buffer) => Promise<Buffer>;
    hash: (message: Buffer) => Promise<Buffer>;
}

const isomorphic: Isomorphic = {
    fetch: async () => Promise.reject(new Error("not implemented")),
    hmac: async () => Promise.reject(new Error("not implemented")),
    hash: async () => Promise.reject(new Error("not implemented"))
};

export default isomorphic;
