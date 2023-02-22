import type { IEstimateResponse, IEstimateRequest } from "jewl-core";
import { PreciseNumber } from "jewl-core";
import type { PropsWithChildren, ReactElement } from "react";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { CurrencyType } from "./enum";
import { useLoading } from "./loading";
import { apiClient } from "./network";

const initialEstimateRequest: IEstimateRequest = {
    input: { coin: "BTC", amount: new PreciseNumber(0.01) },
    output: [{ coin: "ETH", percentage: new PreciseNumber(1) }]
};

interface IUseEstimate {
    editing: CurrencyType;
    setEditing: (editing: CurrencyType) => void;
    deliveryTime?: number;
    isLoading: boolean;
}

interface IUseAmount {
    coin: string;
    network?: string;
    amount?: PreciseNumber;
    usdEquivalent?: PreciseNumber;
    setCurrency: (coin: string, network: string) => void;
    setAmount: (amount: PreciseNumber) => void;
}

interface IGlobalEstimate {
    editing: CurrencyType;
    setEditing: (editing: CurrencyType) => void;
    estimateRequest: IEstimateRequest;
    setEstimateRequest: (request: IEstimateRequest) => void;
    estimateResponse?: IEstimateResponse;
    isLoading: boolean;
}

const Context = createContext<IGlobalEstimate>({
    editing: CurrencyType.Input,
    setEditing: () => { /* Empty */ },
    estimateRequest: initialEstimateRequest,
    setEstimateRequest: () => { /* Empty */ },
    isLoading: false
});

export const useInput = (): IUseAmount => {
    const { estimateRequest, setEstimateRequest, estimateResponse } = useContext(Context);
    const coin = useMemo(() => estimateRequest.input.coin, [estimateRequest]);
    const network = useMemo(() => estimateRequest.input.network, [estimateRequest]);
    const amount = useMemo(() => estimateResponse?.input.amount, [estimateResponse]);
    const usdEquivalent = useMemo(() => estimateResponse?.input.usdEquivalent, [estimateResponse]);

    const setCurrency = useCallback((newCoin: string, newNetwork: string) => {
        const input = estimateRequest.input;
        const output = estimateRequest.output[0];
        setEstimateRequest({
            input: { ...input, coin: newCoin, network: newNetwork },
            output: [output]
        });
    }, [estimateRequest, setEstimateRequest]);

    const setAmount = useCallback((newAmount: PreciseNumber) => {
        const input = estimateRequest.input;
        const output = estimateRequest.output[0];
        setEstimateRequest({
            input: { ...input, amount: newAmount },
            output: [output]
        });
    }, [estimateRequest, setEstimateRequest]);

    return { coin, network, amount, usdEquivalent, setCurrency, setAmount };
};

export const useOutput = (): IUseAmount => {
    const { estimateRequest, setEstimateRequest, estimateResponse } = useContext(Context);
    const coin = useMemo(() => estimateRequest.output[0].coin, [estimateRequest]);
    const network = useMemo(() => estimateRequest.output[0].network, [estimateRequest]);
    const amount = useMemo(() => estimateResponse?.output[0].amount, [estimateResponse]);
    const usdEquivalent = useMemo(() => estimateResponse?.output[0].usdEquivalent, [estimateResponse]);

    const setCurrency = useCallback((newCoin: string, newNetwork: string) => {
        const input = estimateRequest.input;
        const output = estimateRequest.output[0];
        setEstimateRequest({
            input,
            output: [{ ...output, coin: newCoin, network: newNetwork }]
        });
    }, [estimateRequest, setEstimateRequest]);

    const setAmount = useCallback((newAmount: PreciseNumber) => {
        const input = estimateRequest.input;
        const output = estimateRequest.output[0];
        setEstimateRequest({
            input,
            output: [{ ...output, amount: newAmount }]
        });
    }, [estimateRequest, setEstimateRequest]);

    return { coin, network, amount, usdEquivalent, setCurrency, setAmount };
};

export const useEstimate = (): IUseEstimate => {
    const { editing, setEditing, estimateResponse, isLoading } = useContext(Context);
    const deliveryTime = useMemo(() => estimateResponse?.deliveryTime, [estimateResponse]);

    return { editing, setEditing, deliveryTime, isLoading };
};

const EstimateProvider = (props: PropsWithChildren): ReactElement => {
    const [editing, setEditing] = useState(CurrencyType.Input);
    const [estimateResponse, setEstimateResponse] = useState<IEstimateResponse>();
    const [estimateRequest, setEstimateRequest] = useState(initialEstimateRequest);
    const { isLoading, setLoading } = useLoading();

    const reloadEstimate = useCallback(() => {
        if (document.hidden) { return; }
        setLoading(true);
        apiClient.getEstimate(estimateRequest)
            .then(setEstimateResponse)
            .catch(console.log)
            .finally(() => setLoading(false));
    }, [setEstimateResponse, setLoading, estimateRequest]);

    useEffect(() => {
        setLoading(true);
        setEstimateResponse(undefined);
        let interval: NodeJS.Timer | null = null;
        const timeout = setTimeout(() => {
            reloadEstimate();
            interval = setInterval(() => reloadEstimate(), 10000);
        }, 1000);
        return () => {
            clearTimeout(timeout);
            if (interval != null) { clearInterval(interval); }
        };
    }, [setLoading, setEstimateResponse, reloadEstimate]);

    // Purposefully not including deps as this should only run once
    useEffect(() => reloadEstimate(), []);

    const context = useMemo(() => {
        return {
            editing,
            setEditing,
            estimateRequest,
            setEstimateRequest,
            estimateResponse,
            isLoading
        };
    }, [editing, setEditing, estimateResponse, estimateRequest, setEstimateRequest, isLoading]);

    return <Context.Provider value={context}>{props.children}</Context.Provider>;
};

export default EstimateProvider;
