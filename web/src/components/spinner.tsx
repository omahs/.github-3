import "../styles/spinner.css";
import type { ReactElement } from "react";
import React, { Component } from "react";


export default class Spinner extends Component {

    public shouldComponentUpdate(): boolean {
        return false;
    }

    public render(): ReactElement {
        return <div className="spinner" />;
    }
}
