import "../styles/front.css";
import type { ReactElement } from "react";
import React, { Component } from "react";

export default class Front extends Component {

    public componentDidMount(): void {
        console.log("front");
    }

    public shouldComponentUpdate(): boolean {
        return true;
    }

    public render(): ReactElement {
        return (
            <div className="front">
                Home
            </div>
        );
    }
}
