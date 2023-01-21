import type { ReactElement } from "react";
import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./components/app";
import type { AuthorizationParams } from "@auth0/auth0-react";
import { Auth0Provider } from "@auth0/auth0-react";

const authUrl = process.env.REACT_APP_AUTH0_URL ?? "";
const authId = process.env.REACT_APP_AUTH0_ID ?? "";

const authorizationParams: AuthorizationParams = {
    audience: process.env.REACT_APP_SERVER_URL
};

const Root = (): ReactElement => {
    return (
        <StrictMode>
            <Auth0Provider domain={authUrl} clientId={authId} authorizationParams={authorizationParams}>
                <App />
            </Auth0Provider>
        </StrictMode>
    );
};

const root = document.getElementById("root") ?? new HTMLElement();
createRoot(root).render(<Root />);
