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

/**
    A simple spinner that can be shown during loading of the page.
**/
const Spinner = (): ReactElement => {
    return <FontAwesomeIcon className="spinner" icon={faCircleNotch} />;
};

/**
    The app component that will either show the frontpage or the
    authenticated backpage. This component also handles the robots
    meta tag by disabling indexing on any page that is not `jewl.app`.
**/
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

/**
    The Auth0 login url that the user can be navigated to for
    logging into jewl.app. This property is fetched from
    the env variables.
**/
const authUrl = process.env.REACT_APP_AUTH0_URL ?? "";

/**
    The Auth0 client id that is needed for logging into
    jewl.app. This property is fetched from the env variables.
**/
const authId = process.env.REACT_APP_AUTH0_ID ?? "";

/**
    The Auth0 audience for which this application
    requests a login. This property is fetched from the
    env variables.
**/
const authorizationParams: AuthorizationParams = {
    audience: process.env.REACT_APP_SERVER_URL
};

/**
    Render the the root component into the `index.html` page.
**/
createRoot(document.getElementById("root") ?? new HTMLElement()).render(
    <StrictMode>
        <Auth0Provider domain={authUrl} clientId={authId} authorizationParams={authorizationParams}>
            <App />
        </Auth0Provider>
    </StrictMode>
);
