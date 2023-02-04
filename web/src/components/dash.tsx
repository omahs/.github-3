import "../styles/dash.css";
import type { ReactElement } from "react";
import React, { useCallback, useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Timeline } from "./timeline";
import { apiClient } from "../modules/network";
import type { IPaymentResponse } from "jewl-core";
import { Method } from "./method";
import { Allocation } from "./allocation";
import { Payment } from "./payment";

export const Dash = (): ReactElement => {
    const [lastPayment, setLastPayment] = useState<IPaymentResponse | null>(null);
    const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);
    const { user, getAccessTokenSilently } = useAuth0();

    useEffect(() => {
        getAccessTokenSilently()
            .then(async x => apiClient.getLastPayment(x))
            .then(setLastPayment)
            .catch(console.log);
    }, []);

    let username = "";
    if (user?.email != null) {
        const parts = user.email.split("@");
        if (parts.length > 0) {
            username = parts[0];
        }
    }

    let callout = "Start Dollar Cost averaging crypto in 3 easy steps!";
    if (lastPayment != null) {
        callout = "You're only a few steps away from reactivating your crypto investment!";
        if (lastPayment.isActive) {
            callout = "You're DCA investment will not auto-renew. Turn on auto-renew to keep investing!";
        }
        if (lastPayment.autoRenew) {
            callout = `You're all set and investing ${lastPayment.amount.toFixed(0)} EUR every x weeks!`;
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

    return (
        <div className="dash">
            <div className="dash-title">Hi, {username}!</div>
            <div className="dash-subtitle">{callout}</div>
            <Method />
            <Allocation />
            <Payment />
            <Timeline />
            <div className="dash-footer">
                <span>Don&apos;t worry, we will also keep you updated on any purchase we make on your behalf via email! </span>
                <span hidden={!(lastPayment?.isActive ?? false)}>
                    <span>If you&apos;ve changed your mind you can request a refund for all your open orders </span>
                    <span className="dash-footer-link" onClick={toggleRefundPopup}>here</span>.
                </span>
            </div>
            <div className="dash-confirmation" hidden={!showConfirmationPopup}>
                <button type="button" onClick={toggleRefundPopup}>Cancel</button>
                <button type="button" onClick={confirmRefund}>Refund</button>
            </div>
        </div>
    );
};
