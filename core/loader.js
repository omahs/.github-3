/* eslint-disable */
/* @ts-ignore */
import { resolve as tsResolve } from "ts-node/esm";
import { load as tsLoad } from "ts-node/esm";
import { extname, dirname } from "path";
import { fileURLToPath } from "url";

const currentFile = fileURLToPath(import.meta.url);
const currentDir = dirname(currentFile);

export const resolve = (path, context, nextResolve) => {
    const isLocal = path.startsWith("./") || path.startsWith("../");
    const hasExtension = extname(path) !== "";
    if (isLocal && !hasExtension) { path = path + ".js"; }
    const protocol = path.includes(":") ? path.split(":")[0] : "";
    switch (protocol) {
        case "url": path = `${currentDir}/identity.js`
        case "css": path = `${currentDir}/identity.js`
    }
    return tsResolve(path, context, nextResolve);
};

export const load = (path, context, nextLoad) => {
    return tsLoad(path, context, nextLoad);
};
