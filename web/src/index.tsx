import "./styles/index.css";
import type { ReactElement } from "react";
import React, { StrictMode, useEffect, useMemo, useState, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { Helmet } from "react-helmet";

const App = lazy(async () => import("./components/app"));
const Header = lazy(async () => import("./components/header"));
const Footer = lazy(async () => import("./components/footer"));
const Loading = lazy(async () => import("./modules/loading"));

const Root = (): ReactElement => {
    const [supportedOrientation, setSupportedOrientation] = useState(true);
    const robots = useMemo(() => window.location.hostname === "jewl.app" ? "index,follow" : "noindex,follow", []);

    useEffect(() => {
        const aspectChanged = (): void => {
            setSupportedOrientation(window.innerHeight >= 512);
        };
        window.addEventListener("resize", aspectChanged);
        aspectChanged();
        return () => window.removeEventListener("resize", aspectChanged);
    }, []);

    const content = useMemo(() => {
        if (supportedOrientation) {
            return <Loading><Header /><App /><Footer /></Loading>;
        }
        return <div className="unsupported" hidden={supportedOrientation}>Please rotate your device to use jewl.app</div>;
    }, [supportedOrientation]);

    return (
        <StrictMode>
            <Helmet><meta name="robots" content={robots} /></Helmet>
            <Suspense>{content}</Suspense>
        </StrictMode>
    );
};

const root = document.getElementById("root") ?? new HTMLElement();
createRoot(root).render(<Root />);
