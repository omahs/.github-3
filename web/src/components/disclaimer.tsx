import "../styles/disclaimer.css";
import { useAuth0 } from "@auth0/auth0-react";
import type { ReactElement } from "react";
import React, { useCallback, useState } from "react";
import { useGlobalState } from "../modules/state";
import { apiClient } from "../modules/network";

export const Disclaimer = (): ReactElement => {
    const { lastPayment } = useGlobalState();
    const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);
    const { getAccessTokenSilently } = useAuth0();

    const confirmRefund = useCallback(() => {
        getAccessTokenSilently()
            .then(async x => apiClient.refundOrders(x))
            .then(() => setShowConfirmationPopup(false))
            .catch(console.log);
    }, []);

    const toggleRefundPopup = useCallback(() => {
        setShowConfirmationPopup(!showConfirmationPopup);
    }, [showConfirmationPopup]);

    return (
        <div className="disclaimer">
            <span>Don&apos;t worry, we will also keep you updated on any purchase we make on your behalf via email! </span>
            <span hidden={!(lastPayment?.isActive ?? false)}>
                <span>If you&apos;ve changed your mind you can request a refund for all your open orders </span>
                <span className="disclaimer-link" onClick={toggleRefundPopup}>here</span>.
            </span>
            <div className="disclaimer-confirmation" hidden={!showConfirmationPopup}>
                <button type="button" onClick={toggleRefundPopup}>Cancel</button>
                <button type="button" onClick={confirmRefund}>Refund</button>
            </div>
        </div>
    );
};
