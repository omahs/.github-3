import "./styles/index.css";
import type { ReactElement } from "react";
import React, { StrictMode, useEffect, useMemo, useState, lazy } from "react";
import { createRoot } from "react-dom/client";
import { Helmet } from "react-helmet";
import { Provider } from "./modules/provider";

const App = lazy(async () => import("./components/app"));

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
            return <App />;
        }
        return <div className="unsupported">Please rotate your device to use jewl.app</div>;
    }, [supportedOrientation]);

    return (
        <StrictMode>
            <Helmet><meta name="robots" content={robots} /></Helmet>
            <Provider>{content}</Provider>
        </StrictMode>
    );
};

const root = document.getElementById("root") ?? new HTMLElement();
createRoot(root).render(<Root />);
