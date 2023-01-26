import "../styles/dash.css";
import type { ReactElement } from "react";
import React, { useCallback, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Timeline } from "./timeline";
import { Checklist } from "./checklist";
import { apiClient } from "../modules/network";


export const Dash = (): ReactElement => {
    const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);
    const { user, getAccessTokenSilently } = useAuth0();

    let username = "";
    if (user?.email != null) {
        const parts = user.email.split("@");
        if (parts.length > 0) {
            username = parts[0];
        }
    }

    const confirmRefund = useCallback(() => {
        getAccessTokenSilently()
            .then(async x => apiClient.refundOrders(x))
            .then(() => setShowConfirmationPopup(false))
            .catch(console.log);
    }, []);

    const toggleRefundPopup = useCallback(() => {
        setShowConfirmationPopup(!showConfirmationPopup);
    }, [showConfirmationPopup]);

    // TODO: not show refund if no payment isActive

    return (
        <div className="dash">
            <div className="dash-title">
                Hi! {username}
            </div>
            <Checklist />
            <Timeline />
            <div className="dash-footer">
                Don&apos;t worry, we will also keep you updated on any purchase we make on your behalf via email!
                If you&apos;ve changed your mind you can refund all your open orders
                {" "}
                <span className="dash-footer-link" onClick={toggleRefundPopup}>here</span>.
            </div>
            <div className="dash-confirmation" hidden={!showConfirmationPopup}>
                <button type="button" onClick={toggleRefundPopup}>Cancel</button>
                <button type="button" onClick={confirmRefund}>Refund</button>
            </div>
        </div>
    );
};
