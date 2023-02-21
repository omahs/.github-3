import "../styles/app.css";
import type { ReactElement } from "react";
import React, { useEffect, useState, useMemo, useCallback, lazy, Suspense } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IEstimateResponse } from "jewl-core";
import { ServerStatus } from "jewl-core";
import { faCircleCheck, faCircleQuestion, faCircleDot, faCirclePause } from "@fortawesome/free-regular-svg-icons";
import { faChevronLeft, faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { useLoading } from "../modules/loading";
import { apiClient } from "../modules/network";

const Estimate = lazy(async () => import("./estimate"));
const Address = lazy(async () => import("./address"));
const Confirm = lazy(async () => import("./confirm"));
const Complete = lazy(async () => import("./complete"));
const contentPages = [Estimate, Address, Confirm, Complete];

const App = (): ReactElement => {
    const [serverStatus, setServerStatus] = useState(ServerStatus.up);
    const { isAnyLoading, setLoading } = useLoading();
    const [pageValidated, setPageValidated] = useState(0);
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
    }, [setLoading, setServerStatus]);


    const statusClicked = useCallback(() => {
        window.open("https://status.jewl.app/", "_blank", "noopener,noreferrer");
    }, []);

    const pageProps = useMemo(() => {
        return (page: number): Record<string, unknown> => {
            return {
                estimate,
                setEstimate,
                setNextEnabled: (enabled: boolean): void => setPageValidated(enabled ? page + 1 : page)
            };
        };
    }, [estimate, setEstimate, setPageValidated]);

    const contentPage = useMemo(() => {
        const Tag = contentPages[index];
        return <Tag {...pageProps(index)} />;
    }, [index, pageProps]);

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
    }, [index, nextEnabled, setIndex]);

    const backPressed = useCallback(() => {
        if (index === 0) { return; }
        if (index === contentPages.length - 1) {
            // TODO: clear the address again
        }
        setIndex(index - 1);
    }, [index, setIndex]);

    const backButton = useMemo(() => {
        if (index === 0) { return null; }
        return (
            <button type="button" className="app-header-button" onClick={backPressed} >
                <FontAwesomeIcon icon={faChevronLeft} />
            </button>
        );
    }, [index, backPressed]);

    const loader = useMemo(() => {
        if (!isAnyLoading) { return null; }
        return <FontAwesomeIcon icon={faCircleNotch} className="app-header-loader" />;
    }, [isAnyLoading]);

    return (
        <div className="app">
            <div className="app-header">
                <span className="app-header-side">{backButton}</span>
                <span className="app-header-title">jewl.app</span>
                <span className="app-header-side">{loader}</span>
            </div>
            <div className="app-content">
                <Suspense>{contentPage}</Suspense>
            </div>
            <div className="app-footer">
                <button type="button" className="app-footer-button" disabled={!nextEnabled} onClick={nextPressed}>
                    Next
                </button>
            </div>
            <span className="app-status" onClick={statusClicked}>
                <FontAwesomeIcon icon={statusIcon} />
                <span>{statusMessage}</span>
            </span>
        </div>
    );
};

export default App;
