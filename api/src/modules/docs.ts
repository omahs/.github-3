import type { Application, Request, Response } from "express";
import type { SwaggerUiOptions } from "swagger-ui-express";
import { serve, generateHTML } from "swagger-ui-express";

export const RegisterDocs = (app: Application): void => {
    const domainPlaceholder = "<DOMAIN />";
    const redirectScript = "if (!window.location.pathname.endsWith(\"/\")) { window.location.pathname = window.location.pathname + \"/\"; }";

    const head = [
        "<meta charset=\"UTF-8\">",
        "<meta name=\"robots\" content=\"noindex,follow\">",
        `<script type="text/javascript">${redirectScript}</script>`
    ];

    const css = `
        .topbar, .info, .servers, .servers-title, #operations-tag-default, .unlocked {
            display: none !important;
        }
        .auth-wrapper:before {
            display: flex;
            justify-content: flex-start;
            align-self: center;
            flex: 1;
            content: '${domainPlaceholder}';
            font-family: sans-serif;
            font-size: 18px;
            font-weight: 700;
        }
    `;

    const specs: SwaggerUiOptions = {
        swaggerOptions: { url: "./swagger.gen.json" },
        customSiteTitle: "jewl.app",
        customCss: css
    };

    const html = generateHTML(undefined, specs)
        .replace("<meta charset=\"UTF-8\">", head.join("\n  "));

    app.use("/", serve, (req: Request, res: Response) => {
        const domain = `${req.get("host")}`;
        const response = html.replace(domainPlaceholder, domain);
        res.send(response);
    });
};
