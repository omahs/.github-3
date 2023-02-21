import { nanoid } from "nanoid";
import type { PropsWithChildren, ReactElement } from "react";
import React, { createContext, useContext, useMemo, useState } from "react";

interface IUseLoading {
    isLoading: boolean;
    isAnyLoading: boolean;
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
    }, [id]); // FIXME: `setGlobalLoading` seems to be changing on ever render.

    const isAnyLoading = useMemo(() => {
        return Object.values(loadingMap).some(x => x);
    }, [loadingMap]);

    const isLoading = useMemo(() => {
        return loadingMap[id] ?? false;
    }, [loadingMap]);

    return {
        isLoading,
        isAnyLoading,
        setLoading
    };
};

const LoadingProvider = (props: PropsWithChildren): ReactElement => {
    const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});

    const setGlobalLoading = useMemo(() => {
        return (key: string, isLoading: boolean): void => {
            setLoadingMap({ ...loadingMap, [key]: isLoading });
        };
    }, [loadingMap, setLoadingMap]);

    const context = useMemo(() => {
        return {
            loadingMap,
            setGlobalLoading
        };
    }, [loadingMap, setGlobalLoading]);

    return <Context.Provider value={context}>{props.children}</Context.Provider>;
};

export default LoadingProvider;
