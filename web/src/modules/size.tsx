import { useEffect, useState } from "react";

/**
    An interface for an object that contains the window's width and height.
**/
interface IUseWindowSize {

    /**
        The window's innerWidth.
    **/
    width: number;

    /**
        The window's innerHeight.
    **/
    height: number;
}

/**
    A simple hook for getting the window's innerHeight and innerWidth.
    These properties are automatically updated when the window size changes.
**/
export const useWindowSize = (): IUseWindowSize => {
    const [width, setWidth] = useState(window.innerWidth);
    const [height, setHeight] = useState(window.innerHeight);

    useEffect(() => {
        const aspectChanged = (): void => {
            setWidth(window.innerWidth);
            setHeight(window.innerHeight);
        };
        window.addEventListener("resize", aspectChanged);
        return () => window.removeEventListener("resize", aspectChanged);
    }, []);

    return { width, height };
};
