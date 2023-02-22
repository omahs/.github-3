import "../styles/address.css";
import type { ChangeEvent, ReactElement } from "react";
import React, { useCallback, useState, useMemo, useEffect } from "react";
import { AddressType } from "../modules/enum";
import { useInput, useOutput } from "../modules/estimate";
import { useCurrencies } from "../modules/currency";
import { useAddress } from "../modules/address";

interface IProps {
    type: AddressType;
}

const Address = (props: IProps): ReactElement => {
    const [plainAddress, setPlainAddress] = useState("");
    const { coin: inputCoin, network: inputNetwork } = useInput();
    const { coin: outputCoin, network: outputNetwork } = useOutput();
    const { getCurrency } = useCurrencies();
    const { setAddress, setMemo } = useAddress();

    const setter = useMemo(() => {
        return props.type === AddressType.Address ? setAddress : setMemo;
    }, [setAddress, setMemo, props.type]);

    const currency = useMemo(() => {
        return getCurrency(outputCoin, outputNetwork);
    }, [getCurrency, outputCoin, outputNetwork]);

    useEffect(() => {
        setPlainAddress("");
    }, [setPlainAddress, inputCoin, inputNetwork, outputCoin, outputNetwork]);

    const isAddressValid = useCallback((address: string) => {
        if (currency == null) { return false; }
        switch (props.type) {
            case AddressType.Address:
                if (address === "") { return false; }
                if (currency.addressRegex == null) { return true; }
                const addressRegex = new RegExp(currency.addressRegex, "ug");
                return address.match(addressRegex) != null;
            case AddressType.Memo:
                if (address === "") { return true; }
                if (currency.memoRegex == null) { return true; }
                const memoRegex = new RegExp(currency.memoRegex, "ug");
                return address.match(memoRegex) != null;
            default: return false;
        }
    }, [currency, props.type]);

    const addressChanged = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        const newText = event.target.value;
        setPlainAddress(newText);
        if (isAddressValid(newText)) {
            setter(newText);
        } else {
            setter();
        }
    }, [isAddressValid, setPlainAddress, setter]);

    const head = useMemo(() => {
        switch (props.type) {
            case AddressType.Address: return "Destination address";
            case AddressType.Memo: return "Destination memo (optional)";
            default: return "";
        }
    }, [props.type]);

    const note = useMemo(() => {
        if (plainAddress === "") { return ""; }
        if (isAddressValid(plainAddress)) { return ""; }
        switch (props.type) {
            case AddressType.Address: return "Invalid address";
            case AddressType.Memo: return "Invalid memo";
            default: return "";
        }
    }, [plainAddress, isAddressValid, props.type]);

    return (
        <>
            <div className="address-head">{head}</div>
            <input type="text" className="address-input" value={plainAddress} onChange={addressChanged} aria-label={head} />
            <div className="address-note">{note}</div>
        </>
    );
};

const OptionalAddress = (props: IProps): ReactElement | null => {
    const { coin, network } = useOutput();
    const { getCurrency } = useCurrencies();

    const currency = useMemo(() => {
        return getCurrency(coin, network);
    }, [getCurrency, coin, network]);

    const shouldHide = currency?.requiresMemo !== true && props.type === AddressType.Memo;
    return shouldHide ? null : <Address {...props} />;
};

export default OptionalAddress;
