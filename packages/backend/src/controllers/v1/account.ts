import { Body, Delete, Get, Post, Route, SuccessResponse, Request, Security } from "tsoa";
import { UserLink } from "../../entities/link.js";
import type { IAccountLinksResponse, IAccountLinkResponse, IAccountTrolleyWidgetRequest, IAccountTrolleyWidgetResponse } from "core";
import { HttpError } from "../../modules/error.js";
import { createWidgetLink } from "../../modules/trolley.js";

@Route("/v1/account")
@Security("token")
export class AccountController {

    @Get("/link")
    public async getLink(@Request() req: any): Promise<IAccountLinksResponse> {
        const links = await UserLink.find({ userId: req.user.userId });
        const mapped = links.map(x => {
            return {
                link: x.link,
                title: x.title,
                description: x.description,
                image: x.image
            };
        });
        return {
            links: mapped
        };
    } 

    @Post("/link")
    @SuccessResponse(201)
    public async createLink(@Request() req: any, @Body() body: IAccountLinkResponse): Promise<IAccountLinkResponse> {
        if (body.link.length < 3) { throw new HttpError(400, "Link needs to be at least 3 characters."); }
        const existingLink = await UserLink.findOne({ link: body.link });
        if (existingLink != null) { throw new HttpError(400, `Link "${body.link}" is already taken.`); }
        const userLinks = await UserLink.find({ userId: req.user.userId });
        if (userLinks.length >= 5) { throw new HttpError(400, "Maximum ammount of links already assinged."); }
        const link = new UserLink({ 
            userId: req.user.userId, 
            link: body.link,
            title: body.title,
            description: body.description,
            image: body.image
        });
        await link.save();
        return body;
    }

    @Delete("/link")
    @SuccessResponse(204)
    public async DeleteLink(@Request() req: any, @Body() body: IAccountLinkResponse): Promise<void> {
        await UserLink.findOneAndDelete({ userId: req.user.userId, link: body.link });
    }

    @Post("/trolley")
    public async getTrolleyWidget(@Request() req: any, @Body() body: IAccountTrolleyWidgetRequest): Promise<IAccountTrolleyWidgetResponse> {
        return {
            widgetLink: createWidgetLink(req.user.userId, body.email)
        };
    }
}