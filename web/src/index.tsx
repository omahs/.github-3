import "./styles/index.css";
import type { ReactElement } from "react";
import { useEffect } from "react";
import React, { StrictMode, useMemo, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { Helmet } from "react-helmet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { SolanaProvider } from "./modules/solana";
import { useWallet } from "@solana/wallet-adapter-react";

const Header = lazy(async () => import("./components/header"));
const Front = lazy(async () => import("./components/front"));
const Back = lazy(async () => import("./components/back"));
const Footer = lazy(async () => import("./components/footer"));

const Spinner = (): ReactElement => {
    return (
        <div className="spinner">
            <FontAwesomeIcon className="spinner-icon" icon={faCircleNotch} />
        </div>
    );
};

const App = (): ReactElement => {
    const { publicKey } = useWallet();
    const robots = useMemo(() => window.location.hostname === "jewl.app" ? "index,follow" : "noindex,follow", []);

    const content = useMemo(() => {
        if (publicKey == null) { return <Front />; }
        return <Back />;
    }, [publicKey]);

    useEffect(() => {
        import("./modules/firebase");
    }, []);

    return (
        <>
            <Helmet><meta name="robots" content={robots} /></Helmet>
            <Header /><Suspense fallback={<Spinner />}>{content}<Footer /></Suspense>
        </>
    );
};

const root = <StrictMode><SolanaProvider><App /></SolanaProvider></StrictMode>;
createRoot(document.getElementById("root") ?? new HTMLElement()).render(root);
