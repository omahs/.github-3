import "../styles/header.css";
import type { ReactElement } from "react";
import React from "react";

const Header = (): ReactElement => {
    return (
        <div className="header">
            <span className="header-spacer" />
            <img src="/icon-outline.svg" className="header-logo" alt="jewl.app logo" loading="lazy" />
        </div>
    );
};

export default Header;
