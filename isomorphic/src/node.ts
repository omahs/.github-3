import isomorphic from "./index.js";
import fetch from "node-fetch";
import { createHmac } from "crypto";

isomorphic.fetch = fetch;
isomorphic.hmac = (message, secret, cipher = "sha256"): Buffer => createHmac(cipher, secret).update(message).digest();

export default isomorphic;
