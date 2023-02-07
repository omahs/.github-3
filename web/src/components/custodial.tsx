import "../styles/custodial.css";
import type { ReactElement } from "react";
import React, { useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowTrendUp } from "@fortawesome/free-solid-svg-icons";
import { useAuth0 } from "@auth0/auth0-react";

export const Custodial = (): ReactElement => {
    const { loginWithRedirect } = useAuth0();

    const ctaPressed = useCallback(() => {
        void loginWithRedirect({ authorizationParams: { redirect_uri: window.location.origin, screen_hint: "signup" } });
    }, []);

    return (
        <div className="custodial">
            <div className="custodial-image">
                <img src="./custodial.svg" className="custodial-image-img" title="Graphic by vectorjuice" alt="Exclusive control of your assets" />
            </div>
            <div className="custodial-text">
                <div className="custodial-title">Your Wallet.<br />Your investment.</div>
                <div className="custodial-message">
                    jewl.app deposits your cryptocurrency straight into your non-custodial wallet giving you exclusive control from the start.
                    Even if jewl.app ceases to exist you will still have full access to your assets (as it is intended in Web3).
                    The same can not be said about the largest cryptocurrency exchanges.
                </div>
                <button className="custodial-cta" type="button" onClick={ctaPressed}>
                    <span> Start Investing </span>
                    <FontAwesomeIcon icon={faArrowTrendUp} />
                </button>
            </div>
        </div>
    );
};


