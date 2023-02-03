import "../styles/checklist.css";
import type { ReactElement } from "react";
import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import type { IPaymentResponse } from "jewl-core";
import { apiClient } from "../modules/network";
import { Method } from "./method";
import { Allocation } from "./allocation";
import { Payment } from "./payment";

export const Checklist = (): ReactElement => {
    const [lastPayment, setLastPayment] = useState<IPaymentResponse | null>(null);
    const { getAccessTokenSilently } = useAuth0();

    useEffect(() => {
        getAccessTokenSilently()
            .then(async x => apiClient.getLastPayment(x))
            .then(setLastPayment)
            .catch(console.log);
    }, []);

    let title = "You're only a few steps away from reactivating your crypto investment";
    if (lastPayment != null) {
        if (lastPayment.amount.eq(0)) {
            title = "Start Dollar Cost averaging crypto in 3 easy steps";
        }

        if (lastPayment.autoRenew) {
            title = "You're all set and investing xyz EUR every x weeks";
        }

        if (lastPayment.isActive) {
            title = "You're DCA investment will not auto-renew. Turn on auto-renew to keep investing";
        }
    }

    return (
        <div className="checklist">
            <div className="checklist-title">{title}</div>
            <div className="checklist-item"><Method /></div>
            <div className="checklist-item"><Allocation /></div>
            <div className="checklist-item"><Payment /></div>
        </div>
    );
};
