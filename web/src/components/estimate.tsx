import "../styles/estimate.css";
import type { ChangeEvent, ReactElement } from "react";
import React, { useCallback, useEffect, useState, useMemo, lazy } from "react";
import type { IEstimateRequest, IEstimateResponse } from "jewl-core";
import { PreciseNumber } from "jewl-core";
import { useLoading } from "../modules/loading";
import { apiClient } from "../modules/network";
import { useCurrencies } from "../modules/currency";

const Selector = lazy(async () => import("./selector"));

const initialEstimateRequest: IEstimateRequest = {
    input: { coin: "ETH", amount: new PreciseNumber(1) },
    output: [{ coin: "BTC", percentage: new PreciseNumber(1) }]
};

interface IProps {
    [key: string]: unknown;
    estimate?: IEstimateResponse;
    setEstimate?: (estimate: IEstimateResponse) => void;
    setNextEnabled?: (enabled: boolean) => void;
}

enum CurrencyType {
    Input = 0,
    Output = 1
}

const Estimate = (props: IProps): ReactElement => {
    const { getCurrency } = useCurrencies();
    const { isLoading, setLoading } = useLoading();
    const [selectCurrency, setSelectCurrency] = useState<CurrencyType | null>(null);
    const [estimateRequest, setEstimateRequest] = useState(initialEstimateRequest);
    const [inputAmount, setInputAmount] = useState("1");
    const [outputAmount, setOutputAmount] = useState("");

    const isAmountValid = useCallback((stringAmount: string, input: boolean) => {
        const item = input ? estimateRequest.input : estimateRequest.output[0];
        const currency = getCurrency(item.coin, item.network);
        if (currency == null) { return false; }
        const amount = new PreciseNumber(stringAmount);
        if (amount.isNaN()) { return false; }
        if (amount.lt(currency.min)) { return false; }
        if (amount.gt(currency.max)) { return false; }
        return true;
    }, [getCurrency, estimateRequest]);

    useEffect(() => {
        if (props.setNextEnabled == null) { return; }
        const isInputValid = isAmountValid(inputAmount, true);
        const isOutputValid = isAmountValid(outputAmount, false);
        props.setNextEnabled(isInputValid && isOutputValid && !isLoading);
    }, [props.setNextEnabled, isAmountValid, estimateRequest, inputAmount, outputAmount, isLoading]);

    const reloadEstimate = useCallback(() => {
        setLoading(true);
        apiClient.getEstimate(estimateRequest)
            .then(props.setEstimate)
            .catch(console.log)
            .finally(() => setLoading(false));
    }, [props.setEstimate, setLoading, estimateRequest]);

    useEffect(() => {
        setLoading(true);
        let interval: NodeJS.Timer | null = null;
        const timeout = setTimeout(() => {
            reloadEstimate();
            interval = setInterval(() => reloadEstimate(), 10000);
        }, 1000);
        return () => {
            clearTimeout(timeout);
            if (interval != null) { clearInterval(interval); }
        };
    }, [setLoading, reloadEstimate]);

    useEffect(() => {
        if (props.estimate == null) { return; }
        if (estimateRequest.input.amount == null) {
            const currency = getCurrency(estimateRequest.input.coin, estimateRequest.input.network);
            const numDecimals = currency?.multiple.dp() ?? 0;
            const amount = props.estimate.input.amount.isPositive()
                ? props.estimate.input.amount.dp(numDecimals).toString()
                : "0";
            setInputAmount(amount);
        } else {
            const currency = getCurrency(estimateRequest.output[0].coin, estimateRequest.output[0].network);
            const numDecimals = currency?.multiple.dp() ?? 0;
            const amount = props.estimate.output[0].amount.isPositive()
                ? props.estimate.output[0].amount.dp(numDecimals).toString()
                : "0";
            setOutputAmount(amount);
        }
    }, [props.estimate, getCurrency]); // Purposefully not including `estimateRequest`

    const formattedInputNote = useMemo(() => {
        if (inputAmount === "") { return ""; }
        if (!isAmountValid(inputAmount, true)) {
            const currency = getCurrency(estimateRequest.input.coin, estimateRequest.input.network);
            if (currency == null) { return ""; }
            return `Amount must be between ${currency.min} and ${currency.max}`;
        }
        if (props.estimate == null) { return ""; }
        if (outputAmount === "") { return ""; }
        const usdEquivalent = props.estimate.input.usdEquivalent.toFixed(2);
        return `~ $${usdEquivalent}`;
    }, [estimateRequest, props.estimate, inputAmount, outputAmount, isAmountValid]);

    const formattedOutputNote = useMemo(() => {
        if (outputAmount === "") { return ""; }
        if (!isAmountValid(outputAmount, false)) {
            const currency = getCurrency(estimateRequest.output[0].coin, estimateRequest.output[0].network);
            if (currency == null) { return ""; }
            return `Amount must be between ${currency.min} and ${currency.max}`;
        }
        if (props.estimate == null) { return ""; }
        if (inputAmount === "") { return ""; }
        const usdEquivalent = props.estimate.output[0].usdEquivalent.toFixed(2);
        return `~ $${usdEquivalent}`;
    }, [estimateRequest, props.estimate, inputAmount, outputAmount, isAmountValid]);

    const inputChanged = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        const newText = event.target.value.onlyNumber();
        setInputAmount(newText);
        if (isAmountValid(newText, true)) {
            const input = {
                coin: estimateRequest.input.coin,
                network: estimateRequest.input.network,
                amount: new PreciseNumber(newText)
            };
            const output = {
                coin: estimateRequest.output[0].coin,
                network: estimateRequest.output[0].network,
                percentage: new PreciseNumber(1)
            };
            setEstimateRequest({ input, output: [output] });
        } else {
            setOutputAmount("");
        }
    }, [setInputAmount, isAmountValid, estimateRequest, setEstimateRequest, setOutputAmount]);

    const outputChanged = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        const newText = event.target.value.onlyNumber();
        setOutputAmount(newText);
        if (isAmountValid(newText, false)) {
            const input = {
                coin: estimateRequest.input.coin,
                network: estimateRequest.input.network
            };
            const output = {
                coin: estimateRequest.output[0].coin,
                network: estimateRequest.output[0].network,
                amount: new PreciseNumber(newText)
            };
            setEstimateRequest({ input, output: [output] });
        } else {
            setInputAmount("");
        }
    }, [setOutputAmount, isAmountValid, estimateRequest, setEstimateRequest, setInputAmount]);

    const inputClicked = useCallback(() => setSelectCurrency(CurrencyType.Input), [setSelectCurrency]);
    const outputClicked = useCallback(() => setSelectCurrency(CurrencyType.Output), [setSelectCurrency]);
    const closeModal = useCallback(() => setSelectCurrency(null), [setSelectCurrency]);

    const currencySelected = useCallback((coin: string, network: string) => {
        const input = estimateRequest.input;
        const output = estimateRequest.output[0];
        if (selectCurrency === CurrencyType.Input) {
            setEstimateRequest({
                input: { ...input, coin, network },
                output: [output]
            });
        }
        if (selectCurrency === CurrencyType.Output) {
            setEstimateRequest({
                input,
                output: [{ ...output, coin, network }]
            });
        }
        setSelectCurrency(null);
    }, [selectCurrency, estimateRequest, setEstimateRequest, setSelectCurrency]);

    const inputCoin = useMemo(() => {
        const currency = getCurrency(estimateRequest.input.coin, estimateRequest.input.network);
        return currency?.coin ?? "";
    }, [getCurrency, estimateRequest]);

    const outputCoin = useMemo(() => {
        const currency = getCurrency(estimateRequest.output[0].coin, estimateRequest.output[0].network);
        return currency?.coin ?? "";
    }, [getCurrency, estimateRequest]);

    const inputName = useMemo(() => {
        const currency = getCurrency(estimateRequest.input.coin, estimateRequest.input.network);
        if (currency == null) { return ""; }
        return currency.coin === currency.network ? currency.name : `${currency.name} on ${currency.networkName}`;
    }, [getCurrency, estimateRequest]);

    const outputName = useMemo(() => {
        const currency = getCurrency(estimateRequest.output[0].coin, estimateRequest.output[0].network);
        if (currency == null) { return ""; }
        return currency.coin === currency.network ? currency.name : `${currency.name} on ${currency.networkName}`;
    }, [getCurrency, estimateRequest]);

    const arrivalTime = useMemo(() => {
        const fees = "No hidden fees";
        if (props.estimate == null) { return fees; }
        const eta = props.estimate.deliveryTime;
        const mins = eta === 1 ? "minute" : "minutes";
        return `Should arrive within ${eta} ${mins} - ${fees}`;
    }, [props.estimate]);

    const popup = useMemo(() => {
        if (selectCurrency == null) { return null; }
        return <Selector onSelect={currencySelected} onCancel={closeModal} />;
    }, [selectCurrency]);

    return (
        <div className="estimate">
            <div className="estimate-head">You send {inputName}</div>
            <div className="estimate-entry">
                <input type="text" className="estimate-input" value={inputAmount} onChange={inputChanged} aria-label="Input amount" placeholder="0.1" />
                <button type="button" className="estimate-currency" onClick={inputClicked}>{inputCoin}</button>
            </div>
            <div className="estimate-note">{formattedInputNote}</div>
            <div className="estimate-head">You get {outputName}</div>
            <div className="estimate-entry">
                <input type="text" className="estimate-input" value={outputAmount} onChange={outputChanged} aria-label="Output amount" placeholder="0.1" />
                <button type="button" className="estimate-currency" onClick={outputClicked}>{outputCoin}</button>
            </div>
            <div className="estimate-note">{formattedOutputNote}</div>
            <div className="estimate-fees">{arrivalTime}</div>
            {popup}
        </div>
    );
};

export default Estimate;
