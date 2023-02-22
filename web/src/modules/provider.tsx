import type { PropsWithChildren, ReactElement } from "react";
import React, { lazy, Suspense } from "react";

const LoadingProvider = lazy(async () => import("./loading"));
const NavigationProvider = lazy(async () => import("./navigation"));
const StatusProvider = lazy(async () => import("./status"));
const CurrencyProvider = lazy(async () => import("./currency"));
const EstimateProvider = lazy(async () => import("./estimate"));
const AddressProvider = lazy(async () => import("./address"));

const providers = [Suspense, LoadingProvider, NavigationProvider,
    StatusProvider, CurrencyProvider, EstimateProvider,
    AddressProvider];

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
