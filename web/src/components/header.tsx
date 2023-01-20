import "../styles/header.css";
import type { ReactElement } from "react";
import React, { Component } from "react";
import type { WithAuth0Props } from "@auth0/auth0-react";
import { withAuth0 } from "@auth0/auth0-react";

class Header extends Component<WithAuth0Props> {
    public constructor(props: WithAuth0Props) {
        super(props);
    }

    private loginPressed(): () => void {
        return (): void => {
            if (this.props.auth0.isAuthenticated) {
                this.props.auth0.logout({ logoutParams: { returnTo: window.location.origin } });
            } else {
                void this.props.auth0.loginWithRedirect({ authorizationParams: { redirect_uri: window.location.origin } });
            }
        };
    }

    public shouldComponentUpdate(): boolean {
        return true;
    }

    public render(): ReactElement {
        return (
            <div className="header">
                <div className="header-content">
                    <a href="/" className="header-link">
                        <img src="/apple-touch-icon.png" className="header-logo" />
                        <span className="header-title">jewl.app</span>
                    </a>
                    <button type="button" onClick={this.loginPressed()} className="header-login">
                        {this.props.auth0.isAuthenticated ? "Logout" : "Login"}
                    </button>
                </div>
            </div>
        );
    }
}

export default withAuth0(Header);
