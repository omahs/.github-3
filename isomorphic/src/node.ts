import isomorphic from "./index.js";
import fetch from "node-fetch";
import { createHmac } from "crypto";

isomorphic.fetch = fetch;
isomorphic.hmac = async (message, secret): Promise<Buffer> => Promise.resolve(createHmac("sha256", secret).update(message).digest());

export default isomorphic;
