import "../styles/fee.css";
import type { ReactElement } from "react";
import React, { useMemo } from "react";
import { useEstimate } from "../modules/estimate";

const Fee = (): ReactElement => {
    const { deliveryTime } = useEstimate();

    const arrivalTime = useMemo(() => {
        const fees = "No hidden fees";
        if (deliveryTime == null) { return fees; }
        const mins = deliveryTime === 1 ? "minute" : "minutes";
        return `Should arrive within ${deliveryTime} ${mins} - ${fees}`;
    }, [deliveryTime]);

    return <div className="fee">{arrivalTime}</div>;
};

export default Fee;
