import "../styles/dca.css";
import type { ReactElement } from "react";
import React from "react";

export const DollarCostAverage = (): ReactElement => {
    return (
        <div className="dca">
            <div className="dca-image">
                <img src="/dca.webp" className="dca-image-img" title="Graphic by vectorjuice" alt="Dollar-cost averaging to reduce effect of price volatility" />
            </div>
            <div className="dca-text">
                <div className="dca-title">The power<br />of DCA</div>
                <div className="dca-message">
                    Dollar-cost averaging can reduce the overall impact of price volatility and lower the average cost per share. By buying regularly in up and down markets, investors buy more shares at lower prices and fewer shares at higher prices. This is great for volatile markets such as crypto.
                </div>
            </div>
        </div>
    );
};
