import "../styles/greeting.css";
import { useAuth0 } from "@auth0/auth0-react";
import type { ReactElement } from "react";
import React, { useMemo } from "react";
import { useGlobalState } from "../modules/state";

export const Greeting = (): ReactElement => {
    const { lastPayment } = useGlobalState();
    const { user } = useAuth0();

    const username = useMemo(() => {
        if (user?.email == null) { return ""; }
        const parts = user.email.split("@");
        if (parts.length === 0) { return ""; }
        return parts[0];
    }, [user]);

    const callout = useMemo(() => {
        if (lastPayment == null) { return "Start Dollar Cost averaging crypto in 3 easy steps!"; }
        if (lastPayment.autoRenew) { return `You're all set and investing ${lastPayment.amount.toFixed(0)} EUR every x weeks!`; }
        if (lastPayment.isActive) { return "You're DCA investment will not auto-renew. Turn on auto-renew to keep investing!"; }
        return "You're only a few steps away from reactivating your crypto investment!";
    }, [lastPayment]);

    return (
        <div className="greeting">
            <div className="greeting-title">Hi, {username}!</div>
            <div className="greeting-subtitle">{callout}</div>
        </div>
    );
};
