import "../styles/app.css";
import type { ReactElement } from "react";
import React, { Component } from "react";
import Back from "./back";
import Front from "./front";
import Header from "./header";
import Footer from "./footer";
import type { WithAuth0Props } from "@auth0/auth0-react";
import { withAuth0 } from "@auth0/auth0-react";
import Spinner from "./spinner";

class App extends Component<WithAuth0Props> {
    public constructor(props: WithAuth0Props) {
        super(props);
    }

    private content(): ReactElement {
        if (this.props.auth0.isLoading) {
            return <Spinner />;
        }

        if (this.props.auth0.isAuthenticated) {
            return <Back />;
        }

        return <Front />;
    }

    public shouldComponentUpdate(): boolean {
        return true;
    }

    public render(): ReactElement {
        return (
            <div className="app">
                <Header />
                {this.content()}
                <Footer />
            </div>
        );
    }
}

export default withAuth0(App);
