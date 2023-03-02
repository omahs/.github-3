import type { Request, Response } from "express";


export const onSend = (req: Request, callback: (body: unknown) => void): void => {
    if (req.res == null) { return; }

    const oldSend = req.res.send;
    req.res.send = (body: unknown): Response => {
        const res = oldSend.bind(req.res)(body);
        callback(body);
        return res;
    };

};
