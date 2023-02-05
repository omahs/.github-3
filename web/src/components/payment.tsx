import { useAuth0 } from "@auth0/auth0-react";
import { PreciseNumber, OrderPeriod } from "jewl-core";
import type { ReactElement } from "react";
import React, { useCallback } from "react";
import { apiClient } from "../modules/network";
import { useGlobalState } from "../modules/state";

export const Payment = (): ReactElement => {
    const { lastPayment, reloadLastPayment } = useGlobalState();
    const { getAccessTokenSilently } = useAuth0();

    const commitPayment = useCallback(() => {
        const amount = new PreciseNumber(1000);
        const installments = 4;
        const period = OrderPeriod.weekly;
        const autoRenew = true;
        getAccessTokenSilently()
            .then(async x => apiClient.initiatePayment(x, amount, installments, period, autoRenew))
            .then(reloadLastPayment)
            .catch(console.log);
    }, []);

    const toggleAutoRenew = useCallback(() => {
        if (lastPayment == null) { return; }
        const newStatus = !lastPayment.autoRenew;
        getAccessTokenSilently()
            .then(async x => apiClient.setAutoRenew(x, newStatus))
            .then(reloadLastPayment)
            .catch(console.log);
    }, [lastPayment]);


    return (
        <div className="app">
            3. Set your DCA amount and interval
            {" "}
            <div hidden={lastPayment?.isActive ?? false}>
                <button type="button" onClick={commitPayment}>
                    Commit
                </button>
            </div>
            <div hidden={!(lastPayment?.isActive ?? false)}>
                Installments: {lastPayment?.installments ?? 0}
                Period: {lastPayment?.installments ?? OrderPeriod.weekly}
                Auto-renew: <input type="checkbox" checked={lastPayment?.autoRenew ?? false} onChange={toggleAutoRenew} />
            </div>
        </div>
    );
};
