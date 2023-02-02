import "../styles/custodial.css";
import type { ReactElement } from "react";
import React from "react";

export const Custodial = (): ReactElement => {
    return (
        <div className="custodial">
            <div className="custodial-image">
                <img src="/custodial.svg" className="custodial-image-img" title="Graphic by vectorjuice" alt="Exclusive control of your assets" />
            </div>
            <div className="custodial-text">
                <div className="custodial-title">Your Wallet.<br />Your investment.</div>
                <div className="custodial-message">
                    jewl.app deposits your cryptocurrency straight into your non-custodial wallet giving you exclusive control from the start.
                    Even if jewl.app ceases to exist you will still have full access to your assets (as it is intended in Web3).
                    The same can not be said about the largest cryptocurrency exchanges.
                </div>
            </div>
        </div>
    );
};


