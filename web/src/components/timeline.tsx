import "../styles/timeline.css";
import type { ReactElement } from "react";
import React, { Component } from "react";
import type { WithAuth0Props } from "@auth0/auth0-react";
import { withAuth0 } from "@auth0/auth0-react";

class Timeline extends Component<WithAuth0Props> {

    public componentDidMount(): void {
        console.log("timeline");
    }

    public shouldComponentUpdate(): boolean {
        return true;
    }

    public render(): ReactElement {
        return (
            <div className="timeline">
                Timeline
            </div>
        );
    }
}

export default withAuth0(Timeline);
