import "../styles/app.css";
import type { ReactElement } from "react";
import React, { lazy, Suspense } from "react";
import { AddressType, CurrencyType } from "../modules/enum";

const Header = lazy(async () => import("./header"));
const Title = lazy(async () => import("./title"));
const Amount = lazy(async () => import("./amount"));
const Fee = lazy(async () => import("./fee"));
const Address = lazy(async () => import("./address"));
const Confirm = lazy(async () => import("./confirm"));
const Status = lazy(async () => import("./status"));
const Footer = lazy(async () => import("./footer"));
const Selector = lazy(async () => import("./selector"));
const Legal = lazy(async () => import("./legal"));
const Complete = lazy(async () => import("./complete"));

const App = (): ReactElement => {
    return (
        <>
            <Suspense>
                <Header />
                <Footer />
            </Suspense>
            <div className="app">
                <Suspense>
                    <Title />
                    <Amount type={CurrencyType.Input} />
                    <Amount type={CurrencyType.Output} />
                    <Address type={AddressType.Address} />
                    <Address type={AddressType.Memo} />
                    <Fee />
                    <Confirm />
                    <Status />
                </Suspense>
            </div>
            <Suspense>
                <Selector />
                <Legal />
                <Complete />
            </Suspense>
        </>
    );
};

export default App;
