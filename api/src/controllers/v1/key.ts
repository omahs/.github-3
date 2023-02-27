import type { IKeyResponse } from "jewl-core";
import { Key } from "jewl-core";
import { nanoid } from "nanoid";
import { Delete, Get, Route, Security, Request, SuccessResponse, Response, Controller, Hidden } from "tsoa";
import type { WithAuthentication } from "../../modules/auth";

/**
    A controller for handling the creation and deletion of a user's
    api keys. A user can only have one active api key at any given time.
**/
@Route("/v1/key")
@Security("token")
@Hidden()
@Response<string>(401, "Unauthorized")
@Response<string>(429, "Too many requests")
export class KeyController extends Controller {

    /**
        Get the api key for the currently logged in user. If no api
        key exists for the user one will be created. This endpoint
        returns 201 in that case.
    **/
    @Get("/")
    @SuccessResponse(200, "Success")
    @Response<IKeyResponse>(201, "Created")
    public async getKey(@Request() req: WithAuthentication): Promise<IKeyResponse> {
        let key = await Key.findOne({ userId: req.user.userId });
        if (key == null) {
            key = new Key({
                userId: req.user.userId,
                key: `${nanoid()}${nanoid()}`
            });
            await key.save();
            this.setStatus(201);
        }
        return { key: key.key };
    }

    /**
        Revoke the api key for the currently logged in user and generates
        a new one.
    **/
    @Delete("/")
    @SuccessResponse(201, "Created")
    public async rollKey(@Request() req: WithAuthentication): Promise<IKeyResponse> {
        await Key.deleteOne({ userId: req.user.userId });
        return this.getKey(req);
    }
}
