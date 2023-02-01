import "../styles/header.css";
import type { ReactElement } from "react";
import React, { useCallback } from "react";
import { useAuth0 } from "@auth0/auth0-react";

export const Header = (): ReactElement => {
    const { isAuthenticated, logout, loginWithRedirect } = useAuth0();

    const loginPressed = useCallback(() => {
        if (isAuthenticated) {
            logout({ logoutParams: { returnTo: window.location.origin } });
        } else {
            void loginWithRedirect({ authorizationParams: { redirect_uri: window.location.origin } });
        }
    }, [isAuthenticated]);

    return (
        <div className="header">
            <div className="header-content">
                <a href="/" className="header-link">
                    <img src="/icon.webp" className="header-logo" alt="jewl.app logo" />
                    <span className="header-title">jewl.app</span>
                </a>
                <button type="button" onClick={loginPressed} className="header-login">
                    {isAuthenticated ? "Logout" : "Login"}
                </button>
            </div>
        </div>
    );
};
