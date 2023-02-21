import "../styles/selector.css";
import type { ReactElement, ChangeEvent } from "react";
import React, { useState, useCallback, useMemo, useRef, lazy } from "react";
import { cryptoIcon } from "jewl-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useCurrencies } from "../modules/currency";

const Popup = lazy(async () => import("./popup"));

interface IProps {
    onSelect?: (coin: string, network: string) => void;
    onCancel?: () => void;
}

const highlightedCurrencies = ["BTC", "ETH", "USDT", "BNB", "USDC", "BUSD", "DAI"];

const Selector = (props: IProps): ReactElement => {
    const { allCurrencies, getCurrency } = useCurrencies();
    const [searchText, setSearchText] = useState("");
    const ref = useRef<HTMLDivElement>(null);

    const searchTextChanged = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setSearchText(event.target.value);
        ref.current?.scrollTo({ top: 0 });
    }, [ref, setSearchText]);

    const selectItem = useMemo(() => {
        return (coin: string, network: string): (() => void) => {
            return (): void => {
                setSearchText("");
                if (props.onSelect == null) { return; }
                props.onSelect(coin, network);
            };
        };
    }, [setSearchText, props.onSelect]);

    const closeModal = useCallback(() => {
        setSearchText("");
        if (props.onCancel == null) { return; }
        props.onCancel();
    }, [setSearchText, props.onCancel]);

    const highlighted = useMemo(() => {
        return highlightedCurrencies.map(x => {
            const currency = getCurrency(x);
            if (currency == null) { return <span key={x} />; }
            return (
                <span className="selector-highlighted-item" key={x} onClick={selectItem(currency.coin, currency.network)}>
                    <img {...cryptoIcon(currency.coin)} height="16px" width="16px" loading="lazy" />
                    <span>{currency.coin}</span>
                </span>
            );
        });
    }, [getCurrency, selectItem]);

    const filteredCurrencies = useMemo(() => {
        let currencies = allCurrencies;
        if (searchText !== "") {
            const search = searchText.toLowerCase();
            currencies = currencies.filter(x => {
                return x.name.toLowerCase().includes(search)
                    || x.coin.toLowerCase().includes(search);
            });
        }
        return currencies;
    }, [allCurrencies, searchText]);

    const currencyItems = useMemo(() => {
        return filteredCurrencies.map(x => {
            const name = x.coin === x.network ? x.name : `${x.name} on ${x.networkName}`;
            return (
                <div className="selector-list-item" key={name + x.coin} onClick={selectItem(x.coin, x.network)}>
                    <img {...cryptoIcon(x.coin)} height="32px" width="32px" loading="lazy" />
                    <span className="selector-list-item-text">
                        <span className="selector-list-item-title">{name}</span>
                        <span className="selector-list-item-subtitle">{x.coin}</span>
                    </span>
                </div>
            );
        });
    }, [filteredCurrencies, selectItem]);

    return (
        <Popup onClick={closeModal} width="min(80vw, 418px)" height="65vh">
            <div className="selector">
                <div className="selector-header">
                    <span className="selector-title">Select a token</span>
                    <button type="button" onClick={closeModal}>
                        <FontAwesomeIcon icon={faClose} color="#d2d5db" size="lg" />
                    </button>
                </div>
                <div className="selector-search">
                    <FontAwesomeIcon icon={faMagnifyingGlass} color="#d2d5db" />
                    <input type="text" className="selector-search-input" placeholder="Search token" value={searchText} onChange={searchTextChanged} aria-label="Search" />
                </div>
                <div className="selector-highlighted">{highlighted}</div>
                <div className="selector-separator" />
                <div className="selector-list" ref={ref}>{currencyItems}</div>
            </div>
        </Popup>
    );
};

export default Selector;
