import type { Request } from "express";
import { HttpError } from "./error.js";
import { createHmac, timingSafeEqual } from "crypto";
import type { JWTVerifyOptions } from "jose";
import { createRemoteJWKSet, jwtVerify } from "jose";
import { Cached, DateTime, Key, Log, Subscription } from "jewl-core";
import { onSend } from "./hooks.js";

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
    const signatureClaim = new URLSearchParams(signatureHeader.replaceAll(",", "&"));
    const timestamp = new DateTime(signatureClaim.get("t") ?? 0);
    if (!timestamp.isNow()) {
        throw new Error("request has expired");
    }

    const signature = Buffer.from(signatureClaim.get("v1") ?? "", "hex");
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
const authenticationMap: Record<string, (req: Request) => Promise<string>> = {
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
    A subsitute for epxress's `Request` if that includes information
    about the logged in user.
**/
export interface WithAuthentication extends Request {
    user: Authentication;
}

/**
    Middleware to handle authentication. This method
    finds the acoompanying authentication method and calls that.
    This method returns a 401 error if authentication fails.
**/
const authentication = async (req: Request, securityName: string, scopes: Array<string>): Promise<Authentication> => {
    try {
        const key = `${securityName}Authentication`;
        if (!Object.hasOwn(authenticationMap, key)) { throw new Error("invalid authentication method"); }
        const userId = await authenticationMap[key](req);
        return { userId, scopes };
    } catch {
        throw new HttpError(401, "invalid or missing authorization.");
    }
};


/**
    Whether or not a user has an active subscription or not. This is cached
    for 60 seconds.
**/
const hasSubscription = new Cached<boolean>();

/**
    A method for validating metered scope. This method will do two things.
    First this method checks if the currently logged in user is subscribed
    and when the requests completes (or fails) the result log is stored in
    the DB.
**/
const meteredValidation = (credits: number): (req: Request, auth: Authentication) => Promise<void> => {
    return async (req: Request, auth: Authentication): Promise<void> => {
        let isSubscribed = hasSubscription.get(auth.userId);
        if (isSubscribed == null) {
            const subscrption = await Subscription.findOne({ userId: auth.userId });
            isSubscribed = subscrption != null;
            hasSubscription.set(isSubscribed, auth.userId);
        }

        if (!isSubscribed) { throw new Error("user does not have an active subscription."); }

        onSend(req, (body: unknown) => {
            const log = new Log({
                userId: auth.userId,
                endpoint: req.path,
                status: req.res?.statusCode,
                response: JSON.stringify(body),
                timestamp: new DateTime(),
                credits
            });
            void log.save();
        });
        return Promise.resolve();
    };
};

/**
    An object that holds all the supported validation methods.
**/
const validationMap: Record<string, (req: Request, auth: Authentication) => Promise<void>> = {
    meteredValidation: meteredValidation(1),
    loggedValidation: meteredValidation(0)
};

/**
    Middleware to handle validation of scopes. This method
    finds the acoompanying validation method and calls that.
    This method returns a 403 error if validation fails.
**/
const validation = async (req: Request, validationName: string, auth: Authentication): Promise<void> => {
    try {
        const key = `${validationName}Validation`;
        if (!Object.hasOwn(validationMap, key)) { throw new Error("invalid scope authentication method"); }
        await validationMap[key](req, auth);
    } catch {
        throw new HttpError(403, `scope validation for ${validationName} failed.`);
    }
};

/**
    Middleware to handle authentication through tsoa. This method does two things.
    (1) it runs the specified authentication method and (2) runs validation on the
    scopes that are supplied in the `@Security()` decorator.
**/
export const expressAuthentication = async (req: Request, securityName: string, scopes: Array<string>): Promise<Authentication> => {
    const auth = await authentication(req, securityName, scopes);
    const promises = scopes.map(async x => validation(req, x, auth));
    await Promise.all(promises);
    return auth;
};
