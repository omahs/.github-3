import { useAuth0 } from "@auth0/auth0-react";
import type { IPaymentResponse } from "jewl-core";
import type { PropsWithChildren, ReactElement } from "react";
import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { apiClient } from "./network";

interface IGlobalState {
    lastPayment: IPaymentResponse | null;
    reloadLastPayment: () => void;
}

const Context = createContext<IGlobalState>({
    lastPayment: null,
    reloadLastPayment: () => { /* Empty */ }
});

export const useGlobalState = (): IGlobalState => {
    return useContext(Context);
};

export const ContextProvider = (props: PropsWithChildren): ReactElement => {
    const [lastPayment, setLastPayment] = useState<IPaymentResponse | null>(null);
    const { getAccessTokenSilently } = useAuth0();

    const reloadLastPayment = useCallback(() => {
        getAccessTokenSilently()
            .then(async x => apiClient.getLastPayment(x))
            .then(setLastPayment)
            .catch(console.log);
    }, []);

    const context = useMemo<IGlobalState>(() => {
        return {
            lastPayment,
            reloadLastPayment
        };
    }, [lastPayment]);

    return (
        <Context.Provider value={context}>
            {props.children}
        </Context.Provider>
    );
};
