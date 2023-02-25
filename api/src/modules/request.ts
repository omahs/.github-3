import type { Application, Request } from "express";
import express from "express";

declare global {
    namespace Express {
        interface Request {

            /**
                The raw body that was sent to the endpoint. This can
                contain anything so caution is advised. If this
                belongs to a json request this is utf8 but could
                very well also be binary data.
            **/
            rawBody: Buffer;
        }
    }
}

/**
    Middleware that parses a request. This method consists of adding
    three separate middlewares. (1) a request parser that parses
    the request as json and a raw buffer. (2) a request parser that
    parses a request as urlencoded data and a raw buffer. (3) serve
    static resources from the `public` folder.
**/
export const RegisterRequestParser = (app: Application): void => {
    app.use(express.json({
        verify: (req: Request, _, buf) => { req.rawBody = buf; }
    }));
    app.use(express.urlencoded({
        extended: false,
        verify: (req: Request, _, buf) => { req.rawBody = buf; }
    }));
    app.use(express.static("./public"));
};
