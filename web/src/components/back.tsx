import "./back.css";
import type { ReactElement } from "react";
import React from "react";
import Greeting from "../back/greeting";


const Back = (): ReactElement => {

    // TODO: verify email

    // TODO: Lazy?

    return (
        <div className="back">
            <Greeting />
        </div>
    );
};

export default Back;
