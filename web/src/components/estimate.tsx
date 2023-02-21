import "../styles/estimate.css";
import type { ChangeEvent, ReactElement } from "react";
import React, { useCallback, useEffect, useState, useMemo, lazy } from "react";
import type { ICurrencyResponseItem, IEstimateRequest, IEstimateResponse } from "jewl-core";
import { PreciseNumber } from "jewl-core";
import { useLoading } from "../modules/loading";
import { apiClient } from "../modules/network";

const Selector = lazy(async () => import("./selector"));

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

enum CurrencyType {
    Input = 0,
    Output = 1
}

const Estimate = (props: IProps): ReactElement => {
    const { isLoading, setLoading } = useLoading();
    const [selectCurrency, setSelectCurrency] = useState<CurrencyType | null>(null);
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
            const currency = props.currencies?.get(estimateRequest.input.currency);
            const numDecimals = currency?.multiple.dp() ?? 0;
            const amount = props.estimate.input.amount.isPositive()
                ? props.estimate.input.amount.dp(numDecimals).toString()
                : "0";
            setInputAmount(amount);
        } else {
            const currency = props.currencies?.get(estimateRequest.output[0].currency);
            const numDecimals = currency?.multiple.dp() ?? 0;
            const amount = props.estimate.output[0].amount.isPositive()
                ? props.estimate.output[0].amount.dp(numDecimals).toString()
                : "0";
            setOutputAmount(amount);
        }
    }, [props.estimate, props.currencies]); // Purposefully not including `estimateRequest`

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

    }, [props.estimate, props.currencies, inputAmount, outputAmount, isAmountValid]);

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
    }, [props.estimate, props.currencies, inputAmount, outputAmount, isAmountValid]);

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
    }, [setInputAmount, isAmountValid, estimateRequest, setEstimateRequest, setOutputAmount]);

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
    }, [setOutputAmount, isAmountValid, estimateRequest, setEstimateRequest, setInputAmount]);

    const inputClicked = useCallback(() => setSelectCurrency(CurrencyType.Input), [setSelectCurrency]);
    const outputClicked = useCallback(() => setSelectCurrency(CurrencyType.Output), [setSelectCurrency]);
    const closeModal = useCallback(() => setSelectCurrency(null), [setSelectCurrency]);

    const currencySelected = useCallback((currency: string) => {
        const input = estimateRequest.input;
        const output = estimateRequest.output[0];
        if (selectCurrency === CurrencyType.Input) {
            setEstimateRequest({
                input: { ...input, currency },
                output: [output]
            });
        }
        if (selectCurrency === CurrencyType.Output) {
            setEstimateRequest({
                input,
                output: [{ ...output, currency }]
            });
        }
        setSelectCurrency(null);
    }, [selectCurrency, estimateRequest, setEstimateRequest, setSelectCurrency]);

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

    const popup = useMemo(() => {
        if (selectCurrency == null) { return null; }
        return <Selector currencies={props.currencies} onSelect={currencySelected} onCancel={closeModal} />;
    }, [selectCurrency]);

    return (
        <div className="estimate">
            <div className="estimate-head">You send {estimateRequest.input.currency}</div>
            <div className="estimate-entry">
                <input type="text" className="estimate-input" value={inputAmount} onChange={inputChanged} aria-label="Input amount" placeholder="0.1" />
                <button type="button" className="estimate-currency" onClick={inputClicked}>{inputCoin}</button>
            </div>
            <div className="estimate-note">{formattedInputNote}</div>
            <div className="estimate-head">You get {estimateRequest.output[0].currency}</div>
            <div className="estimate-entry">
                <input type="text" className="estimate-input" value={outputAmount} onChange={outputChanged} aria-label="Output amount" placeholder="0.1" />
                <button type="button" className="estimate-currency" onClick={outputClicked}>{outputCoin}</button>
            </div>
            <div className="estimate-note">{formattedOutputNote}</div>
            <div className="estimate-fees">No hidden fees</div>
            {popup}
        </div>
    );
};

export default Estimate;
