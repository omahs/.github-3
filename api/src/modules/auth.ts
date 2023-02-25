import type { Request } from "express";
import { HttpError } from "./error.js";
import { createHmac, timingSafeEqual } from "crypto";
import type { JWTVerifyOptions } from "jose";
import { createRemoteJWKSet, jwtVerify } from "jose";
import { DateTime, Key, queryToObject } from "jewl-core";

/**
    The Auth0 OAuth authentication domain.
**/
const auth0Domain = process.env.AUTH0_URL ?? "";

/**
    The Auth0 OAuth audience domain that should be
    verified for every OAuth token.
**/
const auth0Audience = process.env.AUTH0_AUDIENCE ?? "";

/**
    The Auth0 JWKS url from which the set of valid public keys
    for authentication should be fetched from.
**/
const jwksUrl = new URL(`${auth0Domain}.well-known/jwks.json`);

/**
    The Auth0 JWKS set used for fetching the public keys
    for verifying OAuth tokens.
**/
const jwks = createRemoteJWKSet(jwksUrl);

/**
    A method for verifying the authorization based on a supplied
    OAuth token. This method verifies the OAuth token against
    Auth0's set of public keys.
**/
const tokenAuthentication = async (req: Request): Promise<string> => {
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
};

/**
    A method for verifying the authorization based on a supplied
    api key. This method fetches the owner of the api key. Api keys
    can only be used for a subset of routes.
**/
const keyAuthentication = async (req: Request): Promise<string> => {
    const authorization = req.header("Authorization");
    if (authorization == null) {
        throw new Error("no authorization header");
    }
    const key = await Key.findOne({ key: authorization });
    if (key == null) {
        throw new Error("invalid authorization token");
    }
    return key.userId;
};

/**
    A method for verifying the stripe authentication. This
    method only allows webhook notifications coming from Stripe
    by verifying the signature based on a shared-secret. Timestamps
    are checked to prevent replay attacks.
**/
const stripeAuthentication = async (req: Request): Promise<string> => {
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
};

/**
    An object that holds all the supported authentication methods.
**/
const getUserId: Record<string, (req: Request) => Promise<string>> = {
    tokenAuthentication,
    keyAuthentication,
    stripeAuthentication
};

/**
    The authentication methods return this object as `user`
    in the express request.
**/
export interface Authentication {
    userId: string;
    scopes: Array<string>;
}

/**
    A subsitute for epxress's `Request` if you only require
    the authentication info from the request.
**/
export interface WithAuthentication {
    user: Authentication;
}

/**
    Middleware to handle authentication through tsoa. This method
    finds the acoompanying authentication method and calls that.
    This method returns a 401 error if authentication fails.
**/
export const expressAuthentication = async (req: Request, securityName: string, scopes: Array<string>): Promise<Authentication> => {
    try {
        const key = `${securityName}Authentication`;
        if (!Object.hasOwn(getUserId, key)) { throw new Error("invalid authentication method"); }
        const userId = await getUserId[key](req);
        return { userId, scopes };
    } catch {
        throw new HttpError(401, "invalid or missing authorization.");
    }
};
