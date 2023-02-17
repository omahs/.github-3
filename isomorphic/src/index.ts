/* eslint-disable @typescript-eslint/no-empty-function */

interface Isomorphic {
    fetch: (url: string, req: object) => Promise<object>;
    hmac: (message: Buffer, secret: Buffer) => Promise<Buffer>;
}

const isomorphic: Isomorphic = {
    fetch: async () => Promise.resolve(new Response()),
    hmac: async message => Promise.resolve(message)
};

export default isomorphic;
