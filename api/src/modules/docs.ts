import type { Application, Request, Response } from "express";
import type { SwaggerUiOptions } from "swagger-ui-express";
import { serve, generateHTML } from "swagger-ui-express";

const domain = process.env.AUTH0_AUDIENCE ?? "";

export const RegisterDocs = (app: Application): void => {
    const redirectScript = `
        if (!window.location.pathname.endsWith("/")) {
            window.location.pathname = window.location.pathname + "/";
        }
    `;

    const additionalHead = [
        "<meta name=\"robots\" content=\"noindex,follow\">",
        `<script type="text/javascript">${redirectScript}</script>`
    ];

    const css = `
        .topbar, .info, .servers, .servers-title, #operations-tag-default {
            display: none;
        }
        .auth-wrapper:before {
            display: flex;
            justify-content: flex-start;
            align-self: center;
            flex: 1;
            content: '${domain}';
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
        .replace("<meta charset=\"UTF-8\">", `<meta charset="UTF-8">${additionalHead.join("\n\t\r")}`);

    app.use("/", serve, (_: Request, res: Response) => res.send(html));
};
