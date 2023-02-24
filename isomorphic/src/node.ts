import isomorphic from "./index.js";
import fetch from "node-fetch";
import { createHash, createHmac } from "crypto";

isomorphic.fetch = fetch;
isomorphic.hmac = async (message, secret): Promise<Buffer> => Promise.resolve(createHmac("sha256", secret).update(message).digest());
isomorphic.hash = async (message): Promise<Buffer> => Promise.resolve(createHash("sha256").update(message).digest());

export default isomorphic;
