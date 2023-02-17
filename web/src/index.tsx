import "./styles/index.css";
import type { ReactElement } from "react";
import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./components/app";
import { Helmet } from "react-helmet";
import { Header } from "./components/header";
import { Footer } from "./components/footer";
import { Loading } from "./modules/loading";

const Root = (): ReactElement => {
    const robots = window.location.hostname === "jewl.app" ? "index,follow" : "noindex,follow";

    return (
        <StrictMode>
            <Helmet><meta name="robots" content={robots} /></Helmet>
            <Loading><Header /><App /><Footer /></Loading>
        </StrictMode>
    );
};

const root = document.getElementById("root") ?? new HTMLElement();
createRoot(root).render(<Root />);
