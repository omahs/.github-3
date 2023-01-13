import type { IPingResponse } from "jewl-core";
import { Route, Security, Hidden, Get } from "tsoa";

@Route("/v1/admin")
@Security("token", ["admin"])
@Hidden()
export class AdminController {
    @Get("/")
    public getMessage(): IPingResponse {
        return { message: "admin" };
    }
}
