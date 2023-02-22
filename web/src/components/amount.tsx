import "../styles/amount.css";
import type { ChangeEvent, ReactElement } from "react";
import React, { useMemo, useCallback, useState } from "react";
import { useCurrencies } from "../modules/currency";
import { useEstimate, useInput, useOutput } from "../modules/estimate";
import type { ICurrencyResponseItem } from "jewl-core";
import { PreciseNumber } from "jewl-core";
import { useNavigation } from "../modules/navigation";
import { CurrencyType } from "../modules/enum";

interface IProps {
    type: CurrencyType;
}

const isAmountValid = (stringAmount: string, currency?: ICurrencyResponseItem): boolean => {
    if (currency == null) { return false; }
    const amount = new PreciseNumber(stringAmount);
    if (amount.isNaN()) { return false; }
    if (amount.lt(currency.min)) { return false; }
    if (amount.gt(currency.max)) { return false; }
    return true;
};

const Amount = (props: IProps): ReactElement => {
    const [plainAmount, setPlainAmount] = useState("0.01");
    const { getCurrency } = useCurrencies();
    const { isLoading, editing, setEditing } = useEstimate();
    const input = useInput();
    const output = useOutput();
    const { setSelectCurrency } = useNavigation();

    const { coin, network, amount, usdEquivalent, setAmount } = useMemo(() => {
        return props.type === CurrencyType.Input ? input : output;
    }, [props.type, input, output]);

    const currency = useMemo(() => {
        return getCurrency(coin, network);
    }, [getCurrency, coin, network]);

    const aria = useMemo(() => {
        switch (props.type) {
            case CurrencyType.Input: return "Input amount";
            case CurrencyType.Output: return "Output amount";
            default: return "";
        }
    }, [props.type]);

    const currencyClicked = useCallback(() => setSelectCurrency(props.type), [setSelectCurrency, props.type]);

    const currencyName = useMemo(() => {
        if (currency == null) { return ""; }
        return currency.coin === currency.network
            ? currency.name
            : `${currency.name} on ${currency.networkName}`;
    }, [currency]);

    const head = useMemo(() => {
        switch (props.type) {
            case CurrencyType.Input: return `You send ${currencyName}`;
            case CurrencyType.Output: return `You receive ${currencyName}`;
            default: return "";
        }
    }, [props.type, currencyName]);

    const amountChanged = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        const newText = event.target.value.onlyNumber();
        setPlainAmount(newText);
        setEditing(props.type);
        if (isAmountValid(newText, currency)) {
            setAmount(new PreciseNumber(newText));
        }
    }, [setPlainAmount, setEditing, props.type, currency, setAmount]);

    const formattedAmount = useMemo(() => {
        if (editing === props.type) { return plainAmount; }
        if (isLoading) { return ""; }
        if (amount == null) { return ""; }

        const numDecimals = currency?.multiple.dp() ?? 0;
        return amount.isPositive()
            ? amount.dp(numDecimals).toString()
            : "0";
    }, [editing, props.type, plainAmount, isLoading, amount]);

    const note = useMemo(() => {
        if (formattedAmount === "") { return ""; }
        if (!isAmountValid(formattedAmount, currency)) {
            if (currency == null) { return ""; }
            return `Amount must be between ${currency.min} and ${currency.max}`;
        }
        if (usdEquivalent == null) { return ""; }
        const usdAmount = usdEquivalent.toFixed(2);
        return `~ $${usdAmount}`;
    }, [formattedAmount, currency, usdEquivalent]);

    return (
        <>
            <div className="amount-head">{head}</div>
            <div className="amount-entry">
                <input type="text" className="amount-input" value={formattedAmount} onChange={amountChanged} aria-label={aria} />
                <button type="button" className="amount-currency" onClick={currencyClicked}>{coin}</button>
            </div>
            <div className="amount-note">{note}</div>
        </>
    );
};

export default Amount;
