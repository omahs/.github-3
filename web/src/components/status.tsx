import "../styles/status.css";
import type { ReactElement } from "react";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";

interface IProps {
    icon: IconDefinition;
    title: string;
    message?: string;
}

export const Status = (props: IProps): ReactElement => {
    return (
        <div className="status">
            <div className="status-image">
                <FontAwesomeIcon className="status-image-icon" icon={props.icon} />
            </div>
            <div className="status-title">{props.title}</div>
            <div className="status-message" hidden={props.message == null}>{props.message ?? ""}</div>
        </div>
    );
};
