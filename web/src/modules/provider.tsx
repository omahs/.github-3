import type { PropsWithChildren, ReactElement } from "react";
import React, { lazy, Suspense } from "react";

const LoadingProvider = lazy(async () => import("./loading"));
const StatusProvider = lazy(async () => import("./status"));
const CurrencyProvider = lazy(async () => import("./currency"));
const EstimateProvider = lazy(async () => import("./estimate"));

const providers = [Suspense, LoadingProvider, StatusProvider, CurrencyProvider, EstimateProvider];

interface IProps extends PropsWithChildren {
    index?: number;
}

export const Provider = (props: IProps): ReactElement => {
    const index = props.index ?? 0;
    const Tag = providers[index];
    let children = props.children;
    if (index < providers.length - 1) {
        children = <Provider index={index + 1}>{props.children}</Provider>;
    }
    return <Tag>{children}</Tag>;
};
