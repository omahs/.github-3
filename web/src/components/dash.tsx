import "../styles/dash.css";
import type { ReactElement } from "react";
import React, { Component } from "react";
import type { WithAuth0Props } from "@auth0/auth0-react";
import { withAuth0 } from "@auth0/auth0-react";
import Timeline from "./timeline";
import Checklist from "./checklist";
import { apiClient } from "../modules/network";

interface IState {
    userName: string;
    showConfirmationPopup: boolean;
}

class Dash extends Component<WithAuth0Props, IState> {

    public constructor(props: WithAuth0Props) {
        super(props);
        this.state = {
            userName: "",
            showConfirmationPopup: false
        };
    }

    public componentDidMount(): void {
        this.props.auth0
            .getAccessTokenSilently()
            .then(() => this.setUsername())
            .catch(console.log);
    }

    private setUsername(): void {
        const email = this.props.auth0.user?.email;
        if (email == null) { return; }
        const parts = email.split("@");
        if (parts.length < 1) { return; }
        this.setState({ userName: parts[0] });
    }

    private refundPopup(open: boolean): () => void {
        return (): void => {
            this.setState({ showConfirmationPopup: open });
        };
    }

    private confirmRefund(): () => void {
        return (): void => {
            this.props.auth0
                .getAccessTokenSilently()
                .then(async x => apiClient.refundOrders(x))
                .then(() => this.setState({ showConfirmationPopup: false }))
                .catch(console.log);
        };
    }

    public shouldComponentUpdate(): boolean {
        return true;
    }

    public render(): ReactElement {
        return (
            <div className="dash">
                <div className="dash-title">
                    Hi! {this.state.userName}
                </div>
                <Checklist />
                <Timeline />
                <div className="dash-footer">
                    Don&apos;t worry, we will also keep you updated on any purchase we make on your behalf via email!
                    If you&apos;ve changed your mind you can refund all your open orders
                    {" "}
                    <span className="dash-footer-link" onClick={this.refundPopup(true)}>here</span>.
                </div>
                <div className="dash-confirmation" hidden={!this.state.showConfirmationPopup}>
                    <button type="button" onClick={this.refundPopup(false)}>Cancel</button>
                    <button type="button" onClick={this.confirmRefund()}>Refund</button>
                </div>
            </div>
        );
    }
}

export default withAuth0(Dash);
