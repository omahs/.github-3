import "../styles/admin.css";
import type { ReactElement } from "react";
import React, { Component } from "react";

export default class Admin extends Component {

    public componentDidMount(): void {
        console.log("admin");
    }

    public shouldComponentUpdate(): boolean {
        return true;
    }

    public render(): ReactElement {
        return (
            <div className="front">
                Admin
            </div>
        );
    }
}
