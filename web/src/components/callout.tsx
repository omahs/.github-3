import "../styles/callout.css";
import type { ReactElement } from "react";
import React, { useCallback } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowTrendUp } from "@fortawesome/free-solid-svg-icons";

export const Callout = (): ReactElement => {
    const { loginWithRedirect } = useAuth0();

    const ctaPressed = useCallback(() => {
        void loginWithRedirect({ authorizationParams: { redirect_uri: window.location.origin, screen_hint: "signup" } });
    }, []);

    return (
        <div className="callout">
            <div className="callout-title">The only crypto platform<br />you will ever need</div>
            <div className="callout-subtitle">Set up once, invest automatically in your favorite crypto assets.</div>
            <button className="callout-cta" type="button" onClick={ctaPressed}>
                <span> Start Investing </span>
                <FontAwesomeIcon icon={faArrowTrendUp} />
            </button>
        </div>
    );
};
