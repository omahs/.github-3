import "../styles/dca.css";
import type { ReactElement } from "react";
import React, { useCallback } from "react";
import { faArrowTrendUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuth0 } from "@auth0/auth0-react";

export const DollarCostAverage = (): ReactElement => {
    const { loginWithRedirect } = useAuth0();

    const ctaPressed = useCallback(() => {
        void loginWithRedirect({ authorizationParams: { redirect_uri: window.location.origin, screen_hint: "signup" } });
    }, []);

    return (
        <div className="dca">
            <div className="dca-image">
                <img src="./dca.svg" className="dca-image-img" title="Graphic by vectorjuice" alt="Dollar-cost averaging to reduce effect of price volatility" />
            </div>
            <div className="dca-text">
                <div className="dca-title">The power<br />of DCA</div>
                <div className="dca-message">
                    Dollar-cost averaging can reduce the overall impact of price volatility and lower the average cost per share. By buying regularly in up and down markets, investors buy more shares at lower prices and fewer shares at higher prices. This is great for volatile markets such as crypto.
                </div>
                <button className="dca-cta" type="button" onClick={ctaPressed}>
                    <span> Start Investing </span>
                    <FontAwesomeIcon icon={faArrowTrendUp} />
                </button>
            </div>
        </div>
    );
};
