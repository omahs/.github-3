import "./back.css";
import type { ReactElement } from "react";
import React from "react";
import Greeting from "../back/greeting";

/**
    The Back component that contains the dashboard for
    a logged in user. This component will render a verify
    email page if the user has not verified their email yet.
**/
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
