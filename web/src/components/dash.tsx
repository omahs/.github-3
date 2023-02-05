import "../styles/dash.css";
import type { ReactElement } from "react";
import React, { useEffect } from "react";
import { Timeline } from "./timeline";
import { Method } from "./method";
import { Allocation } from "./allocation";
import { Payment } from "./payment";
import { useGlobalState } from "../modules/state";
import { Greeting } from "./greeting";
import { Disclaimer } from "./disclaimer";

export const Dash = (): ReactElement => {
    const { reloadLastPayment } = useGlobalState();

    useEffect(reloadLastPayment, []);

    return (
        <div className="dash">
            <Greeting />
            <Method />
            <Allocation />
            <Payment />
            <Timeline />
            <Disclaimer />
        </div>
    );
};
