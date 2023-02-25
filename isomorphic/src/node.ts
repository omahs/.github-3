import isomorphic from "./index.js";
import fetch from "node-fetch";
import { createHash, createHmac } from "crypto";

/**
    The Node implementation of the `fetch` method. This
    uses the the `node-fetch` package.
**/
isomorphic.fetch = fetch;

/**
    The Node implementation of the `hmac` method. This
    uses node's built-in crypto api.
**/
isomorphic.hmac = async (message, secret): Promise<Buffer> => Promise.resolve(createHmac("sha256", secret).update(message).digest());

/**
    The Node implementation of the `hash` method. This
    uses node's built-in crypto api.
**/
isomorphic.hash = async (message): Promise<Buffer> => Promise.resolve(createHash("sha256").update(message).digest());

export default isomorphic;
