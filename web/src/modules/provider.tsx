import type { PropsWithChildren, ReactElement } from "react";
import React, { lazy, Suspense } from "react";

const CurrencyProvider = lazy(async () => import("./currency"));
const LoadingProvider = lazy(async () => import("./loading"));

const providers = [Suspense, LoadingProvider, CurrencyProvider];

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
