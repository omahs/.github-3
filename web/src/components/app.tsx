import "../styles/app.css";
import type { ReactElement } from "react";
import React from "react";
import { Back } from "./back";
import { Front } from "./front";
import { Header } from "./header";
import { Footer } from "./footer";
import { useAuth0 } from "@auth0/auth0-react";
import { Spinner } from "./spinner";

export const App = (): ReactElement => {
    const { isLoading, isAuthenticated } = useAuth0();

    let content: ReactElement = <Front />;
    if (isLoading) {
        content = <Spinner />;
    }

    if (isAuthenticated) {
        content = <Back />;
    }

    return (
        <div className="app">
            <Header />
            <div className="scrollframe">
                {content}
                <Footer />
            </div>
        </div>
    );
};
