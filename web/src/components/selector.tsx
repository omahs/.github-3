import "../styles/selector.css";
import type { ReactElement, ChangeEvent } from "react";
import React, { useState, useCallback, useMemo, lazy } from "react";
import type { ICurrencyResponseItem } from "jewl-core";
import { cryptoIcon } from "jewl-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

const Popup = lazy(async () => import("./popup"));

interface IProps {
    currencies?: Map<string, ICurrencyResponseItem>;
    onSelect?: (selected: string) => void;
    onCancel?: () => void;
}

const highlightedCurrencies = [
    "Bitcoin",
    "Ethereum",
    "TetherUS on Ethereum (ERC20)",
    "BNB",
    "USD Coin on Ethereum (ERC20)",
    "BUSD on Ethereum (ERC20)",
    "Dai on Ethereum (ERC20)"
];

const Selector = (props: IProps): ReactElement => {
    const [searchText, setSearchText] = useState("");

    const searchTextChanged = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setSearchText(event.target.value);
    }, [setSearchText]);

    const selectItem = useMemo(() => {
        return (item: string): (() => void) => {
            return (): void => {
                setSearchText("");
                if (props.onSelect == null) { return; }
                props.onSelect(item);
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
            const currency = props.currencies?.get(x);
            if (currency == null) { return <span key={x} />; }
            return (
                <span className="selector-highlighted-item" key={x} onClick={selectItem(x)}>
                    <img {...cryptoIcon(currency.coin)} height="16px" width="16px" loading="lazy" />
                    <span>{currency.coin}</span>
                </span>
            );
        });
    }, [props.currencies, selectItem]);

    const filteredCurrencies = useMemo(() => {
        if (props.currencies == null) { return []; }
        let currencies = Array.from(props.currencies.values());
        if (searchText !== "") {
            const search = searchText.toLowerCase();
            currencies = currencies.filter(x => {
                return x.name.toLowerCase().includes(search)
                    || x.coin.toLowerCase().includes(search);
            });
        }
        return currencies;
    }, [props.currencies, searchText]);

    const items = useMemo(() => {
        return filteredCurrencies.map(x => {
            return (
                <div className="selector-list-item" key={x.name} onClick={selectItem(x.name)}>
                    <img {...cryptoIcon(x.coin)} height="32px" width="32px" loading="lazy" />
                    <span className="selector-list-item-text">
                        <span className="selector-list-item-title">{x.name}</span>
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
                        <FontAwesomeIcon icon={faClose} color="#e5e5e5" size="lg" />
                    </button>
                </div>
                <div className="selector-search">
                    <FontAwesomeIcon icon={faMagnifyingGlass} color="#e5e5e5" />
                    <input type="text" className="selector-search-input" placeholder="Search token" value={searchText} onChange={searchTextChanged} aria-label="Search" />
                </div>
                <div className="selector-highlighted">{highlighted}</div>
                <div className="selector-separator" />
                <div className="selector-list">{items}</div>
            </div>
        </Popup>
    );
};

export default Selector;
