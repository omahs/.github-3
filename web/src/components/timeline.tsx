import "../styles/timeline.css";
import type { ReactElement } from "react";
import React, { useState, useEffect } from "react";
import type { IOrderResponse } from "jewl-core";
import { apiClient } from "../modules/network";
import { useAuth0 } from "@auth0/auth0-react";
import { useGlobalState } from "../modules/state";

export const Timeline = (): ReactElement => {
    const { lastPayment } = useGlobalState();
    const [openOrders, setOpenOrders] = useState<Array<IOrderResponse>>([]);
    const { getAccessTokenSilently } = useAuth0();

    useEffect(() => {
        getAccessTokenSilently()
            .then(async x => apiClient.getOpenOrders(x))
            .then(x => setOpenOrders(x.orders))
            .catch(console.error);
    }, []);

    return (
        <div className="timeline">
            Timeline
            { JSON.stringify(openOrders) }
            { JSON.stringify(lastPayment?.autoRenew) }
        </div>
    );
};
