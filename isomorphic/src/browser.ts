import isomorphic from "./index.js";

/**
    The browser implementation of the `fetch` method. This
    uses the window's fetch api.
**/
isomorphic.fetch = self.fetch.bind(self);

/**
    The browser implementation of the `hmac` method. This
    uses the subtle crypto browser api.
**/
isomorphic.hmac = async (message, secret): Promise<Buffer> => {
    const algo = { name: "HMAC", hash: "SHA-256" };
    const key = await self.crypto.subtle.importKey("raw", secret, algo, false, ["sign", "verify"]);
    const sig = await self.crypto.subtle.sign(algo, key, message);
    return Buffer.from(sig);
};

/**
    The browser implementation of the `hash` method. This
    uses the subtle crypto browser api.
**/
isomorphic.hash = async (message): Promise<Buffer> => {
    const hash = await self.crypto.subtle.digest("SHA-256", message);
    return Buffer.from(hash);
};

export default isomorphic;
