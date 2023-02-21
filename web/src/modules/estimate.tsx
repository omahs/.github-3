import type { IEstimateResponse, IEstimateRequest } from "jewl-core";
import { PreciseNumber } from "jewl-core";
import type { PropsWithChildren, ReactElement } from "react";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useLoading } from "./loading";
import { apiClient } from "./network";

const initialEstimateRequest: IEstimateRequest = {
    input: { coin: "ETH", amount: new PreciseNumber(1) },
    output: [{ coin: "BTC", percentage: new PreciseNumber(1) }]
};

interface IUseEstimate {
    inputCoin: string;
    inputNetwork?: string;
    inputAmount?: PreciseNumber;
    inputUsd?: PreciseNumber;
    outputCoin: string;
    outputNetwork?: string;
    outputAmount?: PreciseNumber;
    outputUsd?: PreciseNumber;
    deliveryTime?: number;
    isLoading: boolean;
    setInputCurrency: (coin: string, network: string) => void;
    setInputAmount: (amount: PreciseNumber) => void;
    setOutputCurrency: (coin: string, network: string) => void;
    setOutputAmount: (amount: PreciseNumber) => void;
}

interface IGlobalEstimate {
    estimateRequest: IEstimateRequest;
    setEstimateRequest: (request: IEstimateRequest) => void;
    estimateResponse?: IEstimateResponse;
    isLoading: boolean;
}

const Context = createContext<IGlobalEstimate>({
    estimateRequest: initialEstimateRequest,
    setEstimateRequest: () => { /* Empty */ },
    isLoading: false
});

export const useEstimate = (): IUseEstimate => {
    const { estimateRequest, setEstimateRequest, estimateResponse, isLoading } = useContext(Context);
    const inputCoin = useMemo(() => estimateRequest.input.coin, [estimateRequest]);
    const inputNetwork = useMemo(() => estimateRequest.input.network, [estimateRequest]);
    const inputAmount = useMemo(() => estimateResponse?.input.amount, [estimateResponse]);
    const inputUsd = useMemo(() => estimateResponse?.input.usdEquivalent, [estimateResponse]);

    const setInputCurrency = useCallback((coin: string, network: string) => {
        const input = estimateRequest.input;
        const output = estimateRequest.output[0];
        setEstimateRequest({
            input: { ...input, coin, network },
            output: [output]
        });
    }, [estimateRequest, setEstimateRequest]);

    const setInputAmount = useCallback((amount: PreciseNumber) => {
        const input = estimateRequest.input;
        const output = estimateRequest.output[0];
        setEstimateRequest({
            input: { ...input, amount },
            output: [output]
        });
    }, [estimateRequest, setEstimateRequest]);

    const outputCoin = useMemo(() => estimateRequest.output[0].coin, [estimateRequest]);
    const outputNetwork = useMemo(() => estimateRequest.output[0].network, [estimateRequest]);
    const outputAmount = useMemo(() => estimateResponse?.output[0].amount, [estimateResponse]);
    const outputUsd = useMemo(() => estimateResponse?.output[0].usdEquivalent, [estimateResponse]);

    const setOutputCurrency = useCallback((coin: string, network: string) => {
        const input = estimateRequest.input;
        const output = estimateRequest.output[0];
        setEstimateRequest({
            input,
            output: [{ ...output, coin, network }]
        });
    }, [estimateRequest, setEstimateRequest]);

    const setOutputAmount = useCallback((amount: PreciseNumber) => {
        const input = estimateRequest.input;
        const output = estimateRequest.output[0];
        setEstimateRequest({
            input,
            output: [{ ...output, amount }]
        });
    }, [estimateRequest, setEstimateRequest]);

    const deliveryTime = useMemo(() => estimateResponse?.deliveryTime, [estimateResponse]);

    return { inputCoin, inputNetwork, inputAmount, inputUsd, setInputCurrency, setInputAmount,
        outputCoin, outputNetwork, outputAmount, outputUsd, setOutputCurrency, setOutputAmount,
        deliveryTime, isLoading };
};

const EstimateProvider = (props: PropsWithChildren): ReactElement => {
    const [estimateResponse, setEstimateResponse] = useState<IEstimateResponse>();
    const [estimateRequest, setEstimateRequest] = useState(initialEstimateRequest);
    const { isLoading, setLoading } = useLoading();

    const reloadEstimate = useCallback(() => {
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
            estimateRequest,
            setEstimateRequest,
            estimateResponse,
            isLoading
        };
    }, [estimateResponse, estimateRequest, setEstimateRequest, isLoading]);

    return <Context.Provider value={context}>{props.children}</Context.Provider>;
};

export default EstimateProvider;
