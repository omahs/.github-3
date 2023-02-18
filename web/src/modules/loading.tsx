import { nanoid } from "nanoid";
import type { PropsWithChildren, ReactElement } from "react";
import React, { createContext, useContext, useMemo, useState } from "react";

interface IUseLoading {
    isLoading: boolean;
    setLoading: (isLoading: boolean) => void;
}

interface IGlobalLoading {
    loadingMap: Record<string, boolean>;
    setGlobalLoading: (key: string, isLoading: boolean) => void;
}

const Context = createContext<IGlobalLoading>({
    loadingMap: { },
    setGlobalLoading: () => { /* Empty */ }
});

export const useLoading = (): IUseLoading => {
    const { loadingMap, setGlobalLoading } = useContext(Context);
    const id = useMemo(nanoid, []);
    const setLoading = useMemo(() => {
        return (isLoading: boolean): void => {
            setGlobalLoading(id, isLoading);
        };
    }, []);

    const isLoading = useMemo(() => {
        return Object.values(loadingMap).some(x => x);
    }, [loadingMap]);

    return {
        isLoading,
        setLoading
    };
};

export const Loading = (props: PropsWithChildren): ReactElement => {
    const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});

    const setGlobalLoading = useMemo(() => {
        return (key: string, isLoading: boolean): void => {
            setLoadingMap({ ...loadingMap, [key]: isLoading });
        };
    }, [loadingMap]);

    const context = useMemo(() => {
        return {
            loadingMap,
            setGlobalLoading
        };
    }, [loadingMap]);

    return (
        <Context.Provider value={context}>
            {props.children}
        </Context.Provider>
    );
};
