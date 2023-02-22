import "../styles/status.css";
import type { ReactElement } from "react";
import React, { useMemo, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faCirclePause, faCircleQuestion, faCircleDot } from "@fortawesome/free-regular-svg-icons";
import { ServerStatus } from "jewl-core";
import { useStatus } from "../modules/status";

const Status = (): ReactElement => {
    const { serverStatus } = useStatus();

    const statusClicked = useCallback(() => {
        window.open("https://status.jewl.app/", "_blank", "noopener,noreferrer");
    }, []);

    const statusMessage = useMemo(() => {
        switch (serverStatus) {
            case ServerStatus.up: return "All systems operational";
            case ServerStatus.maintainance: return "Down for maintainance";
            case ServerStatus.down: return "Partially degraded service";
            default: return "";
        }
    }, [serverStatus]);

    const statusIcon = useMemo(() => {
        switch (serverStatus) {
            case ServerStatus.up: return faCircleCheck;
            case ServerStatus.maintainance: return faCirclePause;
            case ServerStatus.down: return faCircleQuestion;
            default: return faCircleDot;
        }
    }, [serverStatus]);

    return (
        <span className="status" onClick={statusClicked}>
            <FontAwesomeIcon icon={statusIcon} />
            <span>{statusMessage}</span>
        </span>
    );
};

export default Status;
