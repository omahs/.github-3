import "../styles/dash.css";
import type { ReactElement } from "react";
import React, { Component } from "react";
import type { WithAuth0Props } from "@auth0/auth0-react";
import { withAuth0 } from "@auth0/auth0-react";
import { decodeJwt } from "jose";
import Admin from "./admin";
import User from "./user";

interface IState {
    isAdmin: boolean;
}

class Dash extends Component<WithAuth0Props, IState> {

    public constructor(props: WithAuth0Props) {
        super(props);
        this.state = { isAdmin: false };
    }

    public componentDidMount(): void {
        this.props.auth0.getAccessTokenSilently()
            .then(x => this.handleAuthToken(x))
            .catch(console.log);
    }

    private handleAuthToken(token: string): void {
        const claim = decodeJwt(token);
        const roles = claim.permissions as Array<string> | null;
        if (roles == null) { return; }
        this.setState({ isAdmin: roles.includes("admin") });
    }

    private content(): ReactElement {
        if (this.props.auth0.isLoading) {
            return <div className="spinner" />;
        }

        if (this.state.isAdmin) {
            return <Admin />;
        }

        return <User />;
    }

    public shouldComponentUpdate(): boolean {
        return true;
    }

    public render(): ReactElement {
        return (
            <div className="dash">
                {this.content()}
            </div>
        );
    }
}

export default withAuth0(Dash);
