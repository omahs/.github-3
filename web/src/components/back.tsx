import "../styles/back.css";
import type { ReactElement } from "react";
import React, { Component } from "react";
import type { WithAuth0Props } from "@auth0/auth0-react";
import { withAuth0 } from "@auth0/auth0-react";
import { apiClient } from "../modules/network";
import Spinner from "./spinner";
import Status from "./status";
import Dash from "./dash";
import { faEnvelopeCircleCheck, faPersonDigging } from "@fortawesome/free-solid-svg-icons";

interface IState {
    loading: boolean;
    maintainance: boolean;
    emailVerified: boolean;
}

class Back extends Component<WithAuth0Props, IState> {

    public constructor(props: WithAuth0Props) {
        super(props);
        this.state = {
            loading: true,
            emailVerified: true,
            maintainance: false
        };
    }

    public componentDidMount(): void {
        this.props.auth0
            .getAccessTokenSilently()
            .then(async () => apiClient.ping())
            .then(() => this.setState({ emailVerified: this.props.auth0.user?.email_verified ?? false }))
            .catch(() => this.setState({ maintainance: true }))
            .finally(() => this.setState({ loading: false }));
    }

    private content(): ReactElement {
        if (this.state.loading) {
            return <Spinner />;
        }

        if (!this.state.emailVerified) {
            const message = "Before you can use jewl.app you will need to verify your email address.";
            return <Status icon={faEnvelopeCircleCheck} title="Verify Email" message={message} />;
        }

        if (this.state.maintainance) {
            const message = "jewl.app is currently down for maintainance. We'll be back online shortly.";
            return <Status icon={faPersonDigging} title="Maintainance" message={message} />;
        }

        return <Dash />;
    }

    public shouldComponentUpdate(): boolean {
        return true;
    }

    public render(): ReactElement {
        return (
            <div className="back">
                {this.content()}
            </div>
        );
    }
}

export default withAuth0(Back);
