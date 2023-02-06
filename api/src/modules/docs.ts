import type { Application } from "express";
import type { SwaggerUiOptions } from "swagger-ui-express";
import { setup, serve } from "swagger-ui-express";

export const RegisterDocs = (app: Application): void => {
    const css = `
        .topbar, .info, .servers, .servers-title, #operations-tag-default {
            display: none;
        }
        .auth-wrapper:before {
            display: flex;
            justify-content: flex-start;
            align-self: center;
            flex: 1;
            content: 'jewl.app';
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
    app.use("/", serve, setup(undefined, specs));
};
