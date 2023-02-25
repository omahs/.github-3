import type { Request } from "express";
import { HttpError } from "./error.js";
import { createHmac, timingSafeEqual } from "crypto";
import type { JWTVerifyOptions } from "jose";
import { createRemoteJWKSet, jwtVerify } from "jose";
import { DateTime, Key, queryToObject } from "jewl-core";

const auth0Domain = process.env.AUTH0_URL ?? "";
const auth0Audience = process.env.AUTH0_AUDIENCE ?? "";
const jwksUrl = new URL(`${auth0Domain}.well-known/jwks.json`);
const jwks = createRemoteJWKSet(jwksUrl);

const getUserId: Record<string, (req: Request) => Promise<string>> = {
    token: async (req: Request): Promise<string> => {
        const authorizationToken = req.header("Authorization")?.replace("Bearer ", "");
        if (authorizationToken == null) {
            throw new Error("no authorization header");
        }
        const options: JWTVerifyOptions = {
            audience: auth0Audience,
            issuer: auth0Domain
        };
        const authorizationClaim = await jwtVerify(authorizationToken, jwks, options);
        return authorizationClaim.payload.sub ?? "";
    },
    key: async (req: Request): Promise<string> => {
        const authorization = req.header("Authorization");
        if (authorization == null) {
            throw new Error("no authorization header");
        }
        const key = await Key.findOne({ key: authorization });
        if (key == null) {
            throw new Error("invalid authorization token");
        }
        return key.userId;
    },
    stripe: async (req: Request): Promise<string> => {
        const signatureHeader = req.header("Stripe-Signature") ?? "";
        const signatureClaim = queryToObject(signatureHeader);
        const timestamp = new DateTime(signatureClaim.t);
        if (!timestamp.isNow()) {
            throw new Error("request has expired");
        }

        const signature = Buffer.from(signatureClaim.v1, "hex");
        const preimage = `${timestamp}.${req.rawBody.toString()}`;
        const secret = process.env.STRIPE_SECRET ?? "";

        const hash = createHmac("sha256", secret)
            .update(preimage, "utf8")
            .digest();

        if (!timingSafeEqual(signature, hash)) {
            throw new Error("stripe signature is invalid");
        }
        return Promise.resolve("Stripe");
    }
};

export interface Authentication {
    userId: string;
    scopes: Array<string>;
}

export interface WithAuthentication {
    user: Authentication;
}

export const expressAuthentication = async (req: Request, securityName: string, scopes: Array<string>): Promise<Authentication> => {
    try {
        const userId = await getUserId[securityName](req);
        return { userId, scopes };
    } catch {
        throw new HttpError(401, "invalid or missing authorization.");
    }
};
