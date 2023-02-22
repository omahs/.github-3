import type { PropsWithChildren, ReactElement } from "react";
import React, { createContext, useContext, useState, useMemo } from "react";
import type { CurrencyType } from "./enum";

interface IUseNavigation {
    legalText?: string;
    setLegalText: (text?: string) => void;
    selectCurrency?: CurrencyType;
    setSelectCurrency: (type?: CurrencyType) => void;
    openComplete: boolean;
    setOpenComplete: (complete: boolean) => void;
}

const Context = createContext<IUseNavigation>({
    setLegalText: () => { /* Empty */ },
    setSelectCurrency: () => { /* Empty */ },
    openComplete: false,
    setOpenComplete: () => { /* Empty */ }
});

export const useNavigation = (): IUseNavigation => {
    return useContext(Context);
};

const NavigationProvider = (props: PropsWithChildren): ReactElement => {
    const [legalText, setLegalText] = useState<string>();
    const [selectCurrency, setSelectCurrency] = useState<CurrencyType>();
    const [openComplete, setOpenComplete] = useState(false);

    const context = useMemo(() => {
        return {
            legalText,
            setLegalText,
            selectCurrency,
            setSelectCurrency,
            openComplete,
            setOpenComplete
        };
    }, [legalText, setLegalText, selectCurrency, setSelectCurrency, openComplete, setOpenComplete]);

    return <Context.Provider value={context}>{props.children}</Context.Provider>;
};

export default NavigationProvider;
