import "../styles/popup.css";
import type { PropsWithChildren, ReactElement } from "react";
import React, { useRef, useEffect, useMemo } from "react";

interface IProps extends PropsWithChildren {
    hidden?: boolean;
    height?: string;
    width?: string;
    onClick?: () => void;
}

export const Popup = (props: IProps): ReactElement => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        ref.current?.scrollTo({ top: 0 });
    }, [props.hidden]);

    const style = useMemo(() => {
        return {
            height: props.height ?? "75vh",
            width: props.width ?? "75vw"
        };
    }, [props.height, props.width]);

    return (
        <div className="popup" hidden={props.hidden} >
            <div className="popup-overlay" onClick={props.onClick} />
            <div className="popup-content" ref={ref} style={style}>
                {props.children}
            </div>
        </div>
    );
};
