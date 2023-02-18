import "../styles/estimate.css";
import type { ChangeEvent, ReactElement } from "react";
import React, { useCallback, useEffect, useState, useMemo } from "react";
import type { ICurrencyResponseItem, IEstimateRequest, IEstimateResponse } from "jewl-core";
import { PreciseNumber } from "jewl-core";
import { useLoading } from "../modules/loading";
import { apiClient } from "../modules/network";

const initialEstimateRequest: IEstimateRequest = {
    input: { currency: "Ethereum", amount: new PreciseNumber(1) },
    output: [{ currency: "Bitcoin", percentage: new PreciseNumber(1) }]
};

interface IProps {
    [key: string]: unknown;
    currencies?: Map<string, ICurrencyResponseItem>;
    estimate?: IEstimateResponse;
    setEstimate?: (estimate: IEstimateResponse) => void;
    setNextEnabled?: (enabled: boolean) => void;
}

export const Estimate = (props: IProps): ReactElement => {
    const { setLoading } = useLoading();
    const [estimateRequest, setEstimateRequest] = useState(initialEstimateRequest);
    const [inputAmount, setInputAmount] = useState("1");
    const [outputAmount, setOutputAmount] = useState("");

    const isAmountValid = useCallback((stringCurrency: string, stringAmount: string) => {
        const currency = props.currencies?.get(stringCurrency);
        if (currency == null) { return false; }
        const amount = new PreciseNumber(stringAmount);
        if (amount.isNaN()) { return false; }
        if (amount.lt(currency.min)) { return false; }
        if (amount.gt(currency.max)) { return false; }
        return true;
    }, [props.currencies]);

    useEffect(() => {
        if (props.setNextEnabled == null) { return; }
        const isInputValid = isAmountValid(estimateRequest.input.currency, inputAmount);
        const isOutputValid = isAmountValid(estimateRequest.output[0].currency, outputAmount);
        props.setNextEnabled(isInputValid && isOutputValid);
    }, [isAmountValid, estimateRequest, inputAmount, outputAmount]);

    const reloadEstimate = useCallback(() => {
        setLoading(true);
        apiClient.getEstimate(estimateRequest)
            .then(props.setEstimate)
            .catch(console.log)
            .finally(() => setLoading(false));
    }, [estimateRequest]);

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
    }, [estimateRequest]);

    useEffect(() => {
        if (props.estimate == null) { return; }
        if (estimateRequest.input.amount == null) {
            const currency = props.currencies?.get(estimateRequest.input.currency);
            const numDecimals = currency?.multiple.dp() ?? 0;
            const formatted = props.estimate.input.amount.dp(numDecimals).toString();
            setInputAmount(formatted);
        } else {
            const currency = props.currencies?.get(estimateRequest.output[0].currency);
            const numDecimals = currency?.multiple.dp() ?? 0;
            const formatted = props.estimate.output[0].amount.dp(numDecimals).toString();
            setOutputAmount(formatted);
        }
    }, [props.estimate, props.currencies]);

    const formattedInputNote = useMemo(() => {
        if (inputAmount === "") { return ""; }
        const inputCurrency = props.estimate?.input.currency ?? "";
        if (!isAmountValid(inputCurrency, inputAmount)) {
            const currency = props.currencies?.get(inputCurrency);
            if (currency == null) { return ""; }
            return `Amount must be between ${currency.min} and ${currency.max}`;
        }
        if (props.estimate == null) { return ""; }
        if (outputAmount === "") { return ""; }
        const usdEquivalent = props.estimate.input.usdEquivalent.toFixed(2);
        return `~ $${usdEquivalent}`;

    }, [props.estimate, props.currencies, inputAmount, outputAmount]);

    const inputChanged = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        const newText = event.target.value.onlyNumber();
        setInputAmount(newText);
        if (isAmountValid(estimateRequest.input.currency, newText)) {
            setEstimateRequest({
                input: { currency: estimateRequest.input.currency, amount: new PreciseNumber(newText) },
                output: [{ currency: estimateRequest.output[0].currency, percentage: new PreciseNumber(1) }]
            });
        } else {
            setOutputAmount("");
        }
    }, [isAmountValid, estimateRequest]);

    const formattedOutputNote = useMemo(() => {
        if (outputAmount === "") { return ""; }
        const outputCurrency = props.estimate?.output[0].currency ?? "";
        if (!isAmountValid(outputCurrency, outputAmount)) {
            const currency = props.currencies?.get(outputCurrency);
            if (currency == null) { return ""; }
            return `Amount must be between ${currency.min} and ${currency.max}`;
        }
        if (props.estimate == null) { return ""; }
        if (inputAmount === "") { return ""; }
        const usdEquivalent = props.estimate.output[0].usdEquivalent.toFixed(2);
        return `~ $${usdEquivalent}`;
    }, [props.estimate, props.currencies, inputAmount, outputAmount]);

    const outputChanged = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        const newText = event.target.value.onlyNumber();
        setOutputAmount(newText);
        if (isAmountValid(estimateRequest.output[0].currency, newText)) {
            setEstimateRequest({
                input: { currency: estimateRequest.input.currency },
                output: [{ currency: estimateRequest.output[0].currency, amount: new PreciseNumber(newText) }]
            });
        } else {
            setInputAmount("");
        }
    }, [isAmountValid, estimateRequest]);

    const inputCoin = useMemo(() => {
        const stringCurrency = estimateRequest.input.currency ?? "";
        const currency = props.currencies?.get(stringCurrency);
        return currency?.coin ?? "";
    }, [props.currencies, estimateRequest]);

    const outputCoin = useMemo(() => {
        const stringCurrency = estimateRequest.output[0].currency ?? "";
        const currency = props.currencies?.get(stringCurrency);
        return currency?.coin ?? "";
    }, [props.currencies, estimateRequest]);

    return (
        <div className="estimate">
            <div className="estimate-head">You send {estimateRequest.input.currency}</div>
            <div className="estimate-entry">
                <input type="text" className="estimate-input" value={inputAmount} onChange={inputChanged} />
                <button type="button" className="estimate-currency">{inputCoin}</button>
            </div>
            <div className="estimate-note">{formattedInputNote}</div>
            <div className="estimate-head">You get {estimateRequest.output[0].currency}</div>
            <div className="estimate-entry">
                <input type="text" className="estimate-input" value={outputAmount} onChange={outputChanged} />
                <button type="button" className="estimate-currency">{outputCoin}</button>
            </div>
            <div className="estimate-note">{formattedOutputNote}</div>
            <div className="estimate-fees">No hidden fees</div>
        </div>
    );
};
