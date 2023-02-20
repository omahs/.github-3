import "../styles/app.css";
import type { ReactElement } from "react";
import { useCallback } from "react";
import React, { useEffect, useState, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { ICurrencyResponseItem, IEstimateResponse } from "jewl-core";
import { ServerStatus } from "jewl-core";
import { faCircleCheck, faCircleQuestion, faCircleDot, faCirclePause } from "@fortawesome/free-regular-svg-icons";
import { faChevronLeft, faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { Estimate } from "./estimate";
import { useLoading } from "../modules/loading";
import { apiClient } from "../modules/network";
import { Confirm } from "./confirm";
import { Address } from "./address";
import { Complete } from "./complete";

export const App = (): ReactElement => {
    const [serverStatus, setServerStatus] = useState(ServerStatus.up);
    const { isAnyLoading, setLoading } = useLoading();
    const [pageValidated, setPageValidated] = useState(0);
    const [currencies, setCurrencies] = useState<Map<string, ICurrencyResponseItem>>();
    const [estimate, setEstimate] = useState<IEstimateResponse>();
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const id = setInterval(() => {
            setLoading(true);
            apiClient.getStatus()
                .then(x => setServerStatus(x.status))
                .catch(() => setServerStatus(ServerStatus.down))
                .finally(() => setLoading(false));
        }, 10000);
        return () => clearInterval(id);
    }, [setLoading, setServerStatus, setLoading]);

    useEffect(() => {
        apiClient.getCurrencies()
            .then(x => x.currencies)
            .then(x => new Map(x.map(y => [y.name, y])))
            .then(x => setCurrencies(x))
            .catch(console.log);
    }, [setCurrencies]);

    const statusClicked = useCallback(() => {
        window.open("https://status.jewl.app/", "_blank", "noopener,noreferrer");
    }, []);

    const pageProps = useMemo(() => {
        return (page: number): Record<string, unknown> => {
            return {
                currencies,
                estimate,
                setEstimate,
                setNextEnabled: (enabled: boolean): void => setPageValidated(enabled ? page + 1 : page)
            };
        };
    }, [currencies, estimate, setEstimate, setPageValidated]);

    const contentPages = useMemo(() => {
        return [
            <Estimate key="estimate" {...pageProps(0)} />,
            <Address key="address" {...pageProps(1)} />,
            <Confirm key="confirm" {...pageProps(2)} />,
            <Complete key="complete" {...pageProps(3)} />
        ];
    }, [pageProps]);

    const statusMessage = useMemo(() => {
        switch (serverStatus) {
            case ServerStatus.up: return "All systems operational";
            case ServerStatus.maintainance: return "Down for maintainance";
            case ServerStatus.down: return "Partially degraded service";
            default: return "";
        }
    }, [serverStatus]);

    const statusIcon = useMemo(() => {
        switch (serverStatus) {
            case ServerStatus.up: return faCircleCheck;
            case ServerStatus.maintainance: return faCirclePause;
            case ServerStatus.down: return faCircleQuestion;
            default: return faCircleDot;
        }
    }, [serverStatus]);

    const nextEnabled = useMemo(() => {
        if (serverStatus !== ServerStatus.up) { return false; }
        return pageValidated > index;
    }, [serverStatus, index, pageValidated]);

    const nextPressed = useCallback(() => {
        if (!nextEnabled) { return; }
        if (index === contentPages.length - 1) {
            setIndex(0);
        } else {
            setIndex(index + 1);
        }
    }, [index, contentPages, nextEnabled, setIndex]);

    const backPressed = useCallback(() => {
        if (index === 0) { return; }
        if (index === contentPages.length - 1) {
            // TODO: clear the address again
        }
        setIndex(index - 1);
    }, [index, contentPages, setIndex]);

    return (
        <div className="app">
            <div className="app-header">
                <span className="app-header-side">
                    <button type="button" hidden={index === 0} className="app-header-button" onClick={backPressed} >
                        <FontAwesomeIcon icon={faChevronLeft} />
                    </button>
                </span>
                <span className="app-header-title">jewl.app</span>
                <span className="app-header-side">
                    <span hidden={!isAnyLoading}>
                        <FontAwesomeIcon icon={faCircleNotch} className="app-header-loader" />
                    </span>
                </span>
            </div>
            <div className="app-content">
                {contentPages[index]}
            </div>
            <div className="app-footer">
                <button type="button" className="app-footer-button" disabled={!nextEnabled} onClick={nextPressed}>
                    Next
                </button>
            </div>
            <a className="app-status" onClick={statusClicked}>
                <FontAwesomeIcon icon={statusIcon} />
                <span>{statusMessage}</span>
            </a>
        </div>
    );
};
