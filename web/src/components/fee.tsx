import "../styles/fee.css";
import type { ReactElement } from "react";
import React, { useCallback } from "react";

export const Fee = (): ReactElement => {
    const openPaymentFee = useCallback(() => {
        window.open("https://stripe.com/en-nl/pricing#pricing-details");
    }, []);

    const openTransferFee = useCallback(() => {
        window.open("https://www.fool.com/investing/stock-market/market-sectors/financials/cryptocurrency-stocks/crypto-gas-fees/");
    }, []);

    return (
        <div className="fee">
            <div className="fee-image">
                <img src="./fee.svg" className="fee-image-img" title="Graphic by vectorjuice" alt="Transparent fees through jewl.app" />
            </div>
            <div className="fee-text">
                <div className="fee-title">Pay less.<br />Invest more.</div>
                <div className="fee-message">With a transparent fee system you&apos;ll know exactly what you pay and what you are investing.</div>
                <ul className="fee-list">
                    <li>Payment fee<sup>*</sup></li>
                    <li>Flat 1% jewl.app fee<sup> </sup></li>
                    <li>Transfer fees<sup>**</sup></li>
                </ul>
                <div className="fee-footnote">
                    <div>
                        <sup>*</sup>
                        <span>For exact payment fees please refer to </span>
                        <span className="fee-footnote-link" onClick={openPaymentFee}>Stripe&apos;s website</span>
                        <span>.</span>
                    </div>
                    <div>
                        <sup>**</sup>
                        <span>Transfer fees of crypto assets depend on the chain and the current network congestion. To learn more about transfer fees click </span>
                        <span className="fee-footnote-link" onClick={openTransferFee}>here</span>
                        <span>.</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
