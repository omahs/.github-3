import type { IPingResponse } from "jewl-core";
import { Route, Security, Get } from "tsoa";

@Route("/v1/user")
@Security("token")
export class UserController {
    @Get("/")
    public getMessage(): IPingResponse {
        return { message: "user" };
    }

    // TODO: set allocations and addresses
}
