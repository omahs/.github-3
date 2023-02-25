import "./front.css";
import type { ReactElement } from "react";
import React, { useMemo, useState, useCallback, useEffect, Suspense } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";

/**
    Just a placeholder that will be replaced by actual pages.
**/
const Placeholder = (): ReactElement => {
    return <div />;
};

/**
    The names (so not rendered components) of the different slides.
    Thse slides will be lazily loaded into the page.
**/
const slides = [
    Placeholder,
    Placeholder,
    Placeholder,
    Placeholder
];

/**
    The front component. This component shows infromation about jewl.app
    and encourages users to create an account and try out jewl.app.
**/
const Front = (): ReactElement => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const incrementCurrentIndex = useCallback(() => {
        const next = (currentIndex + 1) % slides.length;
        setCurrentIndex(next);
    }, [currentIndex]);

    useEffect(() => {
        const id = setInterval(incrementCurrentIndex, 30000);
        return () => clearInterval(id);
    }, [currentIndex, incrementCurrentIndex]);

    const currentSlide = useMemo(() => {
        const Tag = slides[currentIndex];
        return <Tag />;
    }, [currentIndex]);

    const dotPressed = useCallback((newIndex: number) => {
        return (): void => {
            if (currentIndex === newIndex) { return; }
            setCurrentIndex(newIndex);
        };
    }, [currentIndex, setCurrentIndex]);

    const dot = useCallback((index: number) => {
        const className = currentIndex === index ? "front-dot-selected" : "front-dot";
        return <FontAwesomeIcon key={index} icon={faCircle} className={className} onClick={dotPressed(index)} />;
    }, [currentIndex, dotPressed]);

    const dots = useMemo(() => {
        return [...Array(slides.length).keys()]
            .map(dot);
    }, [currentIndex, dotPressed]);

    return (
        <div className="front">
            <Suspense>{currentSlide}</Suspense>
            <div className="front-dots">{dots}</div>
        </div>
    );
};

export default Front;
