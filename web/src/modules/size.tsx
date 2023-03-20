import { useEffect, useState } from "react";

interface IUseWindowSize {
    width: number;
    height: number;
}

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
