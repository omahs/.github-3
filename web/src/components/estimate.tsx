import "../styles/estimate.css";
import type { ChangeEvent, ReactElement } from "react";
import React, { useCallback, useEffect, useState, useMemo, lazy } from "react";
import type { ICurrencyResponseItem } from "jewl-core";
import { PreciseNumber } from "jewl-core";
import { useCurrencies } from "../modules/currency";
import { useEstimate } from "../modules/estimate";

const Selector = lazy(async () => import("./selector"));

interface IProps {
    [key: string]: unknown;
    setNextEnabled?: (enabled: boolean) => void;
}

enum CurrencyType {
    Input = 0,
    Output = 1
}

const isAmountValid = (stringAmount: string, currency?: ICurrencyResponseItem): boolean => {
    if (currency == null) { return false; }
    const amount = new PreciseNumber(stringAmount);
    if (amount.isNaN()) { return false; }
    if (amount.lt(currency.min)) { return false; }
    if (amount.gt(currency.max)) { return false; }
    return true;
};

const Estimate = (props: IProps): ReactElement => {
    const { getCurrency } = useCurrencies();
    const [selectCurrency, setSelectCurrency] = useState<CurrencyType | null>(null);
    const [editCurrency, setEditCurrency] = useState(CurrencyType.Input);
    const estimate = useEstimate();
    const [inputAmount, setInputAmount] = useState("1");
    const [outputAmount, setOutputAmount] = useState("");

    const inputCurrency = useMemo(() => {
        return getCurrency(estimate.inputCoin, estimate.inputNetwork);
    }, [getCurrency, estimate.inputCoin, estimate.inputNetwork]);

    const outputCurrency = useMemo(() => {
        return getCurrency(estimate.outputCoin, estimate.outputNetwork);
    }, [getCurrency, estimate.outputCoin, estimate.outputNetwork]);

    const inputChanged = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        const newText = event.target.value.onlyNumber();
        setInputAmount(newText);
        setEditCurrency(CurrencyType.Input);
        setOutputAmount("");
        if (isAmountValid(newText, inputCurrency)) {
            estimate.setInputAmount(new PreciseNumber(newText));
        }
    }, [setInputAmount, setEditCurrency, inputCurrency, estimate.setInputAmount, setOutputAmount]);

    const outputChanged = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        const newText = event.target.value.onlyNumber();
        setOutputAmount(newText);
        setEditCurrency(CurrencyType.Output);
        setInputAmount("");
        if (isAmountValid(newText, outputCurrency)) {
            estimate.setOutputAmount(new PreciseNumber(newText));
        }
    }, [setOutputAmount, setEditCurrency, outputCurrency, estimate.setOutputAmount, setInputAmount]);

    const inputClicked = useCallback(() => setSelectCurrency(CurrencyType.Input), [setSelectCurrency]);
    const outputClicked = useCallback(() => setSelectCurrency(CurrencyType.Output), [setSelectCurrency]);
    const closeModal = useCallback(() => setSelectCurrency(null), [setSelectCurrency]);

    const currencySelected = useCallback((coin: string, network: string) => {
        if (selectCurrency === CurrencyType.Input) {
            estimate.setInputCurrency(coin, network);
        }
        if (selectCurrency === CurrencyType.Output) {
            estimate.setOutputCurrency(coin, network);
        }
        setSelectCurrency(null);
    }, [selectCurrency, estimate.setInputCurrency, estimate.setOutputCurrency, setSelectCurrency]);

    const inputCoin = useMemo(() => {
        return inputCurrency?.coin ?? "";
    }, [inputCurrency]);

    const outputCoin = useMemo(() => {
        return outputCurrency?.coin ?? "";
    }, [outputCurrency]);

    const formattedInputAmount = useMemo(() => {
        if (editCurrency === CurrencyType.Input) { return inputAmount; }
        if (estimate.isLoading) { return ""; }
        if (estimate.inputAmount == null) { return ""; }

        const numDecimals = inputCurrency?.multiple.dp() ?? 0;
        return estimate.inputAmount.isPositive()
            ? estimate.inputAmount.dp(numDecimals).toString()
            : "0";
    }, [editCurrency, inputAmount, estimate.isLoading, estimate.inputAmount, inputCurrency]);

    const formattedOutputAmount = useMemo(() => {
        if (editCurrency === CurrencyType.Output) { return outputAmount; }
        if (estimate.isLoading) { return ""; }
        if (estimate.outputAmount == null) { return ""; }
        const numDecimals = outputCurrency?.multiple.dp() ?? 0;
        return estimate.outputAmount.isPositive()
            ? estimate.outputAmount.dp(numDecimals).toString()
            : "0";
    }, [editCurrency, outputAmount, estimate.isLoading, estimate.outputAmount, outputCurrency]);

    const isInputValid = useMemo(() => {
        return isAmountValid(formattedInputAmount, inputCurrency);
    }, [formattedInputAmount, inputCurrency]);

    const isOutputValid = useMemo(() => {
        return isAmountValid(formattedOutputAmount, outputCurrency);
    }, [formattedOutputAmount, outputCurrency]);

    const formattedInputNote = useMemo(() => {
        if (formattedInputAmount === "") { return ""; }
        if (!isInputValid) {
            if (inputCurrency == null) { return ""; }
            return `Amount must be between ${inputCurrency.min} and ${inputCurrency.max}`;
        }
        if (estimate.inputUsd == null) { return ""; }
        const usdEquivalent = estimate.inputUsd.toFixed(2);
        return `~ $${usdEquivalent}`;
    }, [formattedInputAmount, isInputValid, inputCurrency, estimate.inputUsd]);

    const formattedOutputNote = useMemo(() => {
        if (formattedOutputAmount === "") { return ""; }
        if (!isOutputValid) {
            if (outputCurrency == null) { return ""; }
            return `Amount must be between ${outputCurrency.min} and ${outputCurrency.max}`;
        }
        if (estimate.outputUsd == null) { return ""; }
        const usdEquivalent = estimate.outputUsd.toFixed(2);
        return `~ $${usdEquivalent}`;
    }, [formattedOutputAmount, isOutputValid, outputCurrency, estimate.outputUsd]);

    const inputName = useMemo(() => {
        if (inputCurrency == null) { return ""; }
        return inputCurrency.coin === inputCurrency.network
            ? inputCurrency.name
            : `${inputCurrency.name} on ${inputCurrency.networkName}`;
    }, [inputCurrency]);

    const outputName = useMemo(() => {
        if (outputCurrency == null) { return ""; }
        return outputCurrency.coin === outputCurrency.network
            ? outputCurrency.name
            : `${outputCurrency.name} on ${outputCurrency.networkName}`;
    }, [outputCurrency]);

    const arrivalTime = useMemo(() => {
        const fees = "No hidden fees";
        if (estimate.deliveryTime == null) { return fees; }
        const mins = estimate.deliveryTime === 1 ? "minute" : "minutes";
        return `Should arrive within ${estimate.deliveryTime} ${mins} - ${fees}`;
    }, [estimate.deliveryTime]);

    const popup = useMemo(() => {
        if (selectCurrency == null) { return null; }
        return <Selector onSelect={currencySelected} onCancel={closeModal} />;
    }, [selectCurrency]);

    useEffect(() => {
        if (props.setNextEnabled == null) { return; }
        props.setNextEnabled(isInputValid && isOutputValid && !estimate.isLoading);
    }, [props.setNextEnabled, isInputValid, isOutputValid, estimate.isLoading]);

    return (
        <div className="estimate">
            <div className="estimate-head">You send {inputName}</div>
            <div className="estimate-entry">
                <input type="text" className="estimate-input" value={formattedInputAmount} onChange={inputChanged} aria-label="Input amount" />
                <button type="button" className="estimate-currency" onClick={inputClicked}>{inputCoin}</button>
            </div>
            <div className="estimate-note">{formattedInputNote}</div>
            <div className="estimate-head">You get {outputName}</div>
            <div className="estimate-entry">
                <input type="text" className="estimate-input" value={formattedOutputAmount} onChange={outputChanged} aria-label="Output amount" />
                <button type="button" className="estimate-currency" onClick={outputClicked}>{outputCoin}</button>
            </div>
            <div className="estimate-note">{formattedOutputNote}</div>
            <div className="estimate-fees">{arrivalTime}</div>
            {popup}
        </div>
    );
};

export default Estimate;
