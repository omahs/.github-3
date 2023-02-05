import "../styles/app.css";
import type { ReactElement } from "react";
import React, { useMemo } from "react";
import { Back } from "./back";
import { Front } from "./front";
import { Header } from "./header";
import { Footer } from "./footer";
import { useAuth0 } from "@auth0/auth0-react";
import { Spinner } from "./spinner";

export const App = (): ReactElement => {
    const { isLoading, isAuthenticated } = useAuth0();

    const content = useMemo<ReactElement>(() => {
        if (isAuthenticated) { return <Back />; }
        if (isLoading) { return <Spinner />; }
        return <Front />;
    }, [isLoading, isAuthenticated]);

    return (
        <div className="app">
            <Header />
            <div className="port">
                <div className="content">{content}</div>
                <Footer />
            </div>
        </div>
    );
};
