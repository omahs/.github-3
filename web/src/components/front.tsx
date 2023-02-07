import "../styles/front.css";
import type { ReactElement } from "react";
import React, { useMemo, useState, useCallback, useEffect } from "react";
import { Callout } from "./callout";
import { Custodial } from "./custodial";
import { DollarCostAverage } from "./dca";
import { Fee } from "./fee";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";

const slides: Array<ReactElement> = [
    <Callout key="callout" />,
    <Custodial key="custodial" />,
    <DollarCostAverage key="dca" />,
    <Fee key="fee" />
];

export const Front = (): ReactElement => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const incrementCurrentIndex = useCallback(() => {
        const next = (currentIndex + 1) % slides.length;
        setCurrentIndex(next);
    }, [currentIndex]);

    useEffect(() => {
        const id = setInterval(incrementCurrentIndex, 30000);
        return () => clearInterval(id);
    }, [currentIndex, incrementCurrentIndex]);

    const currentSlide = useMemo(() => slides[currentIndex], [currentIndex]);

    const dotsPressed = useMemo(() => {
        return slides.map((_, i) => () => {
            if (currentIndex === i) { return; }
            setCurrentIndex(i);
        });
    }, [currentIndex]);

    const dots = useMemo(() => {
        return [...Array(slides.length).keys()]
            .map(x => <FontAwesomeIcon key={x} icon={faCircle} className={currentIndex === x ? "dot-selected" : "dot"} onClick={dotsPressed[x]} />);
    }, [currentIndex]);

    return (
        <div className="front">
            {currentSlide}
            <div className="dots">{dots}</div>
        </div>
    );
};
