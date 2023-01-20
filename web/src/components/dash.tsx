import "../styles/dash.css";
import type { ReactElement } from "react";
import React, { Component } from "react";
import type { WithAuth0Props } from "@auth0/auth0-react";
import { withAuth0 } from "@auth0/auth0-react";
import type { ICoinbaseProduct } from "jewl-core";
import { PreciseNumber } from "jewl-core";
import { apiClient, coinbaseClient } from "../modules/network";

interface IState {
    paymentConnected: boolean;
    tokens: Array<string>;
    suggestedAllocation: Record<string, PreciseNumber>;
}

class Dash extends Component<WithAuth0Props, IState> {

    public constructor(props: WithAuth0Props) {
        super(props);
        this.state = {
            paymentConnected: false,
            tokens: [],
            suggestedAllocation: { }
        };
    }

    public componentDidMount(): void {
        coinbaseClient.getProducts()
            .then(x => this.handleCoinbaseProducts(x))
            .catch(console.log);

        this.props.auth0
            .getAccessTokenSilently()
            .then(async x => apiClient.getPaymentMethod(x))
            .then(x => this.setState({ paymentConnected: x.connected }))
            .catch(console.log);
    }

    private handleCoinbaseProducts(products: Array<ICoinbaseProduct>): void {
        const tokens = products.map(x => x.base_currency === "EUR" ? x.quote_currency : x.base_currency);
        const suggestedAllocation = {
            BTC: new PreciseNumber(0.4),
            ETH: new PreciseNumber(0.4),
            USDT: new PreciseNumber(0.2)
        };
        this.setState({ tokens, suggestedAllocation });
    }

    private paymentPressed(): () => void {
        return (): void => {
            if (this.state.paymentConnected) {
                this.props.auth0
                    .getAccessTokenSilently()
                    .then(async x => apiClient.deletePaymentMethod(x))
                    .catch(console.log);
            } else {
                this.props.auth0
                    .getAccessTokenSilently()
                    .then(async x => apiClient.setupPaymentMethod(x, new URL(window.location.href)))
                    .then(x => { window.location.href = x.redirect.toString(); })
                    .catch(console.log);
            }
        };
    }

    public shouldComponentUpdate(): boolean {
        return true;
    }

    public render(): ReactElement {
        return (
            <div className="dash">
                Connected: {this.state.paymentConnected}
                <br />
                <button type="button" onClick={this.paymentPressed()} className="header-login">
                    {this.state.paymentConnected ? "Disconnect" : "Connect"}
                </button>
                <br />
                {this.state.tokens.join(" ")}
                <br />
                {JSON.stringify(this.state.suggestedAllocation)}
            </div>
        );
    }
}

export default withAuth0(Dash);
