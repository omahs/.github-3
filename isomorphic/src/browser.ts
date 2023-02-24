import isomorphic from "./index.js";

isomorphic.fetch = self.fetch.bind(self);

isomorphic.hmac = async (message, secret): Promise<Buffer> => {
    const algo = { name: "HMAC", hash: "SHA-256" };
    const key = await self.crypto.subtle.importKey("raw", secret, algo, false, ["sign", "verify"]);
    const sig = await self.crypto.subtle.sign(algo, key, message);
    return Buffer.from(sig);
};

isomorphic.hash = async (message): Promise<Buffer> => {
    const hash = await self.crypto.subtle.digest("SHA-256", message);
    return Buffer.from(hash);
};

export default isomorphic;
