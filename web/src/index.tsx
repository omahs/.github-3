import "./index.css";
import type { ReactElement } from "react";
import React, { StrictMode, useMemo, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { Helmet } from "react-helmet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import type { AuthorizationParams } from "@auth0/auth0-react";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";

const Header = lazy(async () => import("./components/header"));
const Front = lazy(async () => import("./components/front"));
const Back = lazy(async () => import("./components/back"));
const Footer = lazy(async () => import("./components/footer"));

const Spinner = (): ReactElement => {
    return <FontAwesomeIcon className="spinner" icon={faCircleNotch} />;
};

const App = (): ReactElement => {
    const { isLoading, isAuthenticated } = useAuth0();

    const robots = useMemo(() => window.location.hostname === "jewl.app" ? "index,follow" : "noindex,follow", []);

    const content = useMemo(() => {
        if (isLoading) { return <Spinner />; }
        if (isAuthenticated) { return <Back />; }
        return <Front />;
    }, [isLoading, isAuthenticated]);

    return (
        <>
            <Helmet><meta name="robots" content={robots} /></Helmet>
            <Suspense fallback={<Spinner />}><Header />{content}<Footer /></Suspense>
        </>
    );
};

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
