import "../styles/status.css";
import type { ReactElement } from "react";
import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";

interface IProps {
    icon: IconDefinition;
    title: string;
    message?: string;
}

export default class Status extends Component<IProps> {

    public constructor(props: IProps) {
        super(props);
    }

    public shouldComponentUpdate(): boolean {
        return true;
    }

    public render(): ReactElement {
        return (
            <div className="status">
                <div className="status-image">
                    <FontAwesomeIcon className="status-image-icon" icon={this.props.icon} />
                </div>
                <div className="status-title">{this.props.title}</div>
                <div className="status-message" hidden={this.props.message == null}>{this.props.message ?? ""}</div>
            </div>
        );
    }
}
