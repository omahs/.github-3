import "../styles/back.css";
import type { ReactElement } from "react";
import React, { useEffect, useState, useMemo } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { apiClient } from "../modules/network";
import { Spinner } from "./spinner";
import { Status } from "./status";
import { Dash } from "./dash";
import { faEnvelopeCircleCheck, faPersonDigging } from "@fortawesome/free-solid-svg-icons";
import { ServerStatus } from "jewl-core";

export const Back = (): ReactElement => {
    const [loading, setLoading] = useState(false);
    const [maintainance, setMaintainance] = useState(false);
    const { user } = useAuth0();

    useEffect(() => {
        apiClient.getStatus()
            .then(x => { if (x.status !== ServerStatus.normal) { throw new Error(); } })
            .catch(() => setMaintainance(true))
            .finally(() => setLoading(false));
    }, []);

    const content = useMemo(() => {
        if (loading) { return <Spinner />; }
        if (!(user?.email_verified ?? false)) {
            const message = "Before you can use jewl.app you will need to verify your email address.";
            return <Status icon={faEnvelopeCircleCheck} title="Verify Email" message={message} />;
        }
        if (maintainance) {
            const message = "jewl.app is currently down for maintainance. We'll be back online shortly.";
            return <Status icon={faPersonDigging} title="Maintainance" message={message} />;
        }
        return <Dash />;
    }, [loading, user, maintainance]);

    return (
        <div className="back">
            {content}
        </div>
    );
};
