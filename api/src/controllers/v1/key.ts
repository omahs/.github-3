import type { IKeyResponse } from "jewl-core";
import { Key } from "jewl-core";
import { nanoid } from "nanoid";
import { Delete, Get, Route, Security, Request, Hidden } from "tsoa";
import type { WithAuthentication } from "../../modules/auth";

@Route("/v1/key")
@Security("token")
@Hidden()
export class KeyController {

    /**
        Get the api key for the currently logged in user. If no api
        key exists for the user one will be created.
    **/
    @Get("/")
    public async getKey(@Request() req: WithAuthentication): Promise<IKeyResponse> {
        let key = await Key.findOne({ userId: req.user.userId });
        if (key == null) {
            key = new Key({
                userId: req.user.userId,
                key: `${nanoid()}${nanoid()}`
            });
            await key.save();
        }
        return { key: key.key };
    }

    /**
        Revoke the api key for the currently logged in user and generates
        a new one.
    **/
    @Delete("/")
    public async rollKey(@Request() req: WithAuthentication): Promise<IKeyResponse> {
        await Key.deleteOne({ userId: req.user.userId });
        return this.getKey(req);
    }
}
