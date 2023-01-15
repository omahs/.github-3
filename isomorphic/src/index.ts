/* eslint-disable @typescript-eslint/no-empty-function */

interface Isomorphic {
    fetch: (url: string, req: object) => Promise<object>;
    hmac: (message: Buffer, secret: Buffer, cipher?: string) => Buffer;
}

const isomorphic: Isomorphic = {
    fetch: async () => Promise.resolve(new Response()),
    hmac: message => message
};

export default isomorphic;
