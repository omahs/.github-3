import "./header.css";
import type { ReactElement } from "react";
import React, { useCallback } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const Header = (): ReactElement => {
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
            <span className="header-spacer" />
            <img src="/icon-outline.svg" className="header-logo" alt="jewl.app logo" />
            <span className="header-spacer">
                <button type="button" onClick={loginPressed} className="header-login">
                    {isAuthenticated ? "Logout" : "Login"}
                </button>
            </span>
        </div>
    );
};

export default Header;
