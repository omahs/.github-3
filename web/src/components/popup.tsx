import "../styles/popup.css";
import type { PropsWithChildren, ReactElement } from "react";
import React, { useRef, useMemo } from "react";

interface IProps extends PropsWithChildren {
    height?: string;
    width?: string;
    onClick?: () => void;
}

const Popup = (props: IProps): ReactElement | null => {
    const ref = useRef<HTMLDivElement>(null);

    const style = useMemo(() => {
        return {
            height: props.height ?? "75vh",
            width: props.width ?? "75vw"
        };
    }, [props.height, props.width]);

    return (
        <div className="popup">
            <div className="popup-overlay" onClick={props.onClick} />
            <div className="popup-content" ref={ref} style={style}>{props.children}</div>
        </div>
    );
};

export default Popup;
