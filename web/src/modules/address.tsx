import type { PropsWithChildren, ReactElement } from "react";
import React, { createContext, useContext, useState, useMemo } from "react";

interface IUseAddress {
    address?: string;
    setAddress: (address?: string) => void;
    memo?: string;
    setMemo: (memo?: string) => void;
}

const Context = createContext<IUseAddress>({
    setAddress: () => { /* Empty */ },
    setMemo: () => { /* Empty */ }
});

export const useAddress = (): IUseAddress => {
    return useContext(Context);
};

const AddressProvider = (props: PropsWithChildren): ReactElement => {
    const [address, setAddress] = useState<string>();
    const [memo, setMemo] = useState<string>();

    const context = useMemo(() => {
        return {
            address,
            setAddress,
            memo,
            setMemo
        };
    }, [address, setAddress, memo, setMemo]);

    return <Context.Provider value={context}>{props.children}</Context.Provider>;
};

export default AddressProvider;
