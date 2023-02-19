import "./styles/index.css";
import type { ReactElement } from "react";
import React, { StrictMode, useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./components/app";
import { Helmet } from "react-helmet";
import { Header } from "./components/header";
import { Footer } from "./components/footer";
import { Loading } from "./modules/loading";

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
            {content}
        </StrictMode>
    );
};

const root = document.getElementById("root") ?? new HTMLElement();
createRoot(root).render(<Root />);
