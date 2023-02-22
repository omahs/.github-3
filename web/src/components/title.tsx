import "../styles/title.css";
import type { ReactElement } from "react";
import React, { useMemo } from "react";
import { useLoading } from "../modules/loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";

const Title = (): ReactElement => {
    const { isAnyLoading } = useLoading();

    const loader = useMemo(() => {
        if (!isAnyLoading) { return null; }
        return <FontAwesomeIcon icon={faCircleNotch} className="title-loader" />;
    }, [isAnyLoading]);

    return (
        <div className="title">
            <span className="title-text">jewl.app</span>
            {loader}
        </div>
    );
};

export default Title;
