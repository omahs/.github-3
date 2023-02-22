import { ServerStatus } from "jewl-core";
import type { PropsWithChildren, ReactElement } from "react";
import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from "react";
import { useLoading } from "./loading";
import { apiClient } from "./network";

interface IUseStatus {
    serverStatus: ServerStatus;
    reloadStatus: () => void;
}

interface IGlobalStatus {
    serverStatus: ServerStatus;
    reloadStatus: () => void;
}

const Context = createContext<IGlobalStatus>({
    serverStatus: ServerStatus.up,
    reloadStatus: () => { /* Empty */ }
});

export const useStatus = (): IUseStatus => {
    const { serverStatus, reloadStatus } = useContext(Context);

    return {
        serverStatus,
        reloadStatus
    };
};

const StatusProvider = (props: PropsWithChildren): ReactElement => {
    const [serverStatus, setServerStatus] = useState(ServerStatus.up);
    const { setLoading } = useLoading();

    const reloadStatus = useCallback(() => {
        if (document.hidden) { return; }
        setLoading(true);
        apiClient.getStatus()
            .then(x => setServerStatus(x.status))
            .catch(() => setServerStatus(ServerStatus.down))
            .finally(() => setLoading(false));
    }, [setLoading, setServerStatus]);

    useEffect(() => {
        const id = setInterval(() => reloadStatus, 10000);
        return () => clearInterval(id);
    }, [reloadStatus]);

    const context = useMemo(() => {
        return {
            serverStatus,
            reloadStatus
        };
    }, [serverStatus, reloadStatus]);

    return <Context.Provider value={context}>{props.children}</Context.Provider>;
};

export default StatusProvider;
