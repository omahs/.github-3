import type { ICurrencyResponse, ICurrencyResponseItem } from "jewl-core";
import type { PropsWithChildren, ReactElement } from "react";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { apiClient } from "./network";

interface IUseCurrency {
    getCurrency: (coin: string, network?: string) => ICurrencyResponseItem | undefined;
    allCurrencies: Array<ICurrencyResponseItem>;
    reloadCurrencies: () => void;
}

interface IGlobalCurrencies {
    currencyList: Array<ICurrencyResponseItem>;
    currencyMap: Map<string, ICurrencyResponseItem>;
    reloadCurrencies: () => void;
}

const Context = createContext<IGlobalCurrencies>({
    currencyList: new Array<ICurrencyResponseItem>(),
    currencyMap: new Map<string, ICurrencyResponseItem>(),
    reloadCurrencies: () => { /* Empty */ }
});

export const useCurrencies = (): IUseCurrency => {
    const { currencyMap, currencyList, reloadCurrencies } = useContext(Context);

    const getCurrency = useCallback((coin: string, network?: string) => {
        const key = network == null ? coin : coin + network;
        return currencyMap?.get(key);
    }, [currencyMap]);

    return {
        getCurrency,
        allCurrencies: currencyList,
        reloadCurrencies
    };
};

const CurrencyProvider = (props: PropsWithChildren): ReactElement => {
    const [currencyMap, setCurrencyMap] = useState(new Map<string, ICurrencyResponseItem>());
    const [currencyList, setCurrencyList] = useState(new Array<ICurrencyResponseItem>());

    const updateCurrencyMap = useCallback((response: ICurrencyResponse) => {
        const newMap = new Map<string, ICurrencyResponseItem>();
        for (const currency of response.currencies) {
            newMap.set(currency.coin + currency.network, currency);
            if (currency.isDefault) {
                newMap.set(currency.coin, currency);
            }
        }
        setCurrencyMap(newMap);
        setCurrencyList(response.currencies);
    }, [setCurrencyList]);

    const reloadCurrencies = useCallback(() => {
        apiClient.getCurrencies()
            .then(updateCurrencyMap)
            .catch(console.log);
    }, [updateCurrencyMap]);

    useEffect(reloadCurrencies, [reloadCurrencies]);

    const context = useMemo(() => {
        return {
            currencyMap,
            currencyList,
            reloadCurrencies
        };
    }, [currencyMap, currencyList, reloadCurrencies]);

    return <Context.Provider value={context}>{props.children}</Context.Provider>;
};

export default CurrencyProvider;
