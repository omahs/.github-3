import "../styles/estimate.css";
import type { ReactElement } from "react";
import React, { useCallback, useEffect, useState, useMemo } from "react";
import type { ICurrencyResponseItem, IEstimateRequest, IEstimateResponse } from "jewl-core";
import { PreciseNumber } from "jewl-core";
import { nanoid } from "nanoid";
import { useLoading } from "../modules/loading";
import { apiClient } from "../modules/network";

const initialEstimateRequest: IEstimateRequest = {
    input: { currency: "Ethereum", amount: new PreciseNumber(1) },
    output: [{ currency: "Bitcoin", percentage: new PreciseNumber(1) }]
};

interface IProps {
    [key: string]: unknown;
    currencies?: Record<string, ICurrencyResponseItem>;
    estimate?: IEstimateResponse;
    setEstimate?: (estimate: IEstimateResponse) => void;
    setNextEnabled?: (enabled: boolean) => void;
}

export const Estimate = (props: IProps): ReactElement => {
    const { setLoading } = useLoading();
    const [estimateRequest, setEstimateRequest] = useState(initialEstimateRequest);
    const [estimateNonce, setEstimateNonce] = useState("");

    const _ = setEstimateRequest;

    const inputAmountValid = useMemo(() => {
        if (props.estimate == null) { return null; }
        if (props.currencies == null) { return null; }
        const currency = props.currencies[props.estimate.input.currency];
        return props.estimate.input.amount.gte(currency.min)
            && props.estimate.input.amount.lte(currency.max);
    }, [props.currencies, props.estimate]);

    const outputAmountValid = useMemo(() => {
        if (props.estimate == null) { return null; }
        if (props.currencies == null) { return null; }
        const currency = props.currencies[props.estimate.output[0].currency];
        return props.estimate.output[0].amount.gte(currency.min)
            && props.estimate.output[0].amount.lte(currency.max);
    }, [props.currencies, props.estimate]);

    useEffect(() => {
        if (props.setNextEnabled == null) { return; }
        props.setNextEnabled(inputAmountValid === true && outputAmountValid === true);
    }, [inputAmountValid, outputAmountValid]);

    useEffect(() => {
        setLoading(true);
        apiClient.getEstimate(estimateRequest)
            .then(props.setEstimate)
            .catch(console.log)
            .finally(() => setLoading(false));
    }, [estimateRequest, estimateNonce, setLoading, props.setEstimate]);

    const reloadEstimate = useCallback(() => {
        setEstimateNonce(nanoid());
    }, [setEstimateNonce]);

    useEffect(() => {
        const id = setInterval(reloadEstimate, 10000);
        return () => clearInterval(id);
    }, [reloadEstimate]);

    return (
        <div className="swap">
            {JSON.stringify(props.estimate, null, 3)}
            input: {inputAmountValid === true ? "valid" : "invalid"}
            output: {outputAmountValid === true ? "valid" : "invalid"}
        </div>
    );
};
