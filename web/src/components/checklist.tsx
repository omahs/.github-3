import "../styles/checklist.css";
import type { ReactElement } from "react";
import React, { Component } from "react";
import type { WithAuth0Props } from "@auth0/auth0-react";
import { withAuth0 } from "@auth0/auth0-react";
import type { IAllocationItem, ICoinbaseProduct, IPaymentResponse } from "jewl-core";
import { OrderPeriod } from "jewl-core";
import { PreciseNumber } from "jewl-core";
import { apiClient, coinbaseClient } from "../modules/network";

interface IState {
    tokens: Array<string>;
    allocation: Array<IAllocationItem>;
    isActive: boolean;
    paymentMethod: boolean;
    amount: PreciseNumber;
    installments: number;
    period: OrderPeriod;
    autoRenew: boolean;
}

class Checklist extends Component<WithAuth0Props, IState> {

    public constructor(props: WithAuth0Props) {
        super(props);

        // Const suggestedAllocation = {
        //     BTC: new PreciseNumber(0.4),
        //     ETH: new PreciseNumber(0.4),
        //     USDT: new PreciseNumber(0.2)
        // };

        this.state = {
            tokens: [],
            allocation: [],
            paymentMethod: false,
            isActive: false,
            amount: new PreciseNumber(0),
            installments: 4,
            period: OrderPeriod.weekly,
            autoRenew: false
        };
    }

    public componentDidMount(): void {
        coinbaseClient.getProducts()
            .then(x => this.handleCoinbaseProducts(x))
            .catch(console.log);

        this.props.auth0
            .getAccessTokenSilently()
            .then(async x => apiClient.getPaymentMethod(x))
            .then(x => this.setState({ paymentMethod: x.connected }))
            .catch(console.log);

        this.props.auth0
            .getAccessTokenSilently()
            .then(async x => apiClient.getLastPayment(x))
            .then(x => this.handleLastPayment(x))
            .catch(console.log);

        this.props.auth0
            .getAccessTokenSilently()
            .then(async x => apiClient.getAllocation(x))
            .then(x => this.setState({ allocation: x ?? [] }))
            .catch(console.log);
    }

    private handleLastPayment(lastPayment: IPaymentResponse | null): void {
        if (lastPayment == null) { return; }
        this.setState({
            amount: lastPayment.amount,
            installments: lastPayment.installments,
            period: lastPayment.period,
            autoRenew: lastPayment.autoRenew,
            isActive: lastPayment.isActive
        });
    }

    private handleCoinbaseProducts(products: Array<ICoinbaseProduct>): void {
        const tokens = products.map(x => x.base_currency === "EUR" ? x.quote_currency : x.base_currency);
        this.setState({ tokens });
    }

    private paymentPressed(): () => void {
        return (): void => {
            if (this.state.paymentMethod) {
                this.props.auth0
                    .getAccessTokenSilently()
                    .then(async x => apiClient.deletePaymentMethod(x))
                    .then(() => this.setState({ paymentMethod: false }))
                    .catch(console.log);
            } else {
                this.props.auth0
                    .getAccessTokenSilently()
                    .then(async x => apiClient.setupPaymentMethod(x, new URL(window.location.origin)))
                    .then(x => { window.location.href = x.redirect.toString(); })
                    .catch(console.log);
            }
        };
    }

    private setAllocation(): () => void {
        return (): void => {
            const btc = [
                { currency: "BTC", percentage: new PreciseNumber(1), address: "bc1qlf5797zh08f4e7nr3u2znmem0c95043hh5y230" }
            ];
            this.props.auth0
                .getAccessTokenSilently()
                .then(async x => apiClient.setAllocation(x, btc))
                .then(() => this.setState({ allocation: btc }))
                .catch(console.log);
        };
    }

    private commitPayment(): () => void {
        return (): void => {
            const amount = new PreciseNumber(1000);
            const installments = 4;
            const period = OrderPeriod.weekly;
            const autoRenew = true;
            this.props.auth0
                .getAccessTokenSilently()
                .then(async x => apiClient.initiatePayment(x, amount, installments, period, autoRenew))
                .then(() => this.setState({ amount, installments, period, autoRenew, isActive: true }))
                .catch(console.log);
        };
    }

    private toggledAutoRenew(): () => void {
        return (): void => {
            const newStatus = !this.state.autoRenew;
            this.props.auth0
                .getAccessTokenSilently()
                .then(async x => apiClient.setAutoRenew(x, newStatus))
                .then(() => this.setState({ autoRenew: newStatus }))
                .catch(console.log);
        };
    }

    public shouldComponentUpdate(): boolean {
        return true;
    }

    private title(): string {
        if (this.state.amount.eq(0)) {
            return "Start Dollar Cost averaging crypto in 3 easy steps";
        }

        if (this.state.autoRenew) {
            return "You're all set and investing xyz EUR every x weeks";
        }

        if (this.state.isActive) {
            return "You're DCA investment will not auto-renew. Turn on auto-renew to keep investing";
        }

        return "You're only a few steps away from reactivating your crypto investment";
    }

    public render(): ReactElement {
        return (
            <div className="checklist">
                <div className="checklist-title">
                    {this.title()}
                </div>
                <div className="checklist-item">
                    1. Set up a Payment method
                    {" "}
                    <button type="button" onClick={this.paymentPressed()}>
                        {this.state.paymentMethod ? "Disconnect" : "Connect"}
                        {/* TODO: turn button into visa/master/card/sepa icon */}
                    </button>
                </div>
                <div className="checklist-item">
                    2. Set up your preferred allocation
                    {" "}
                    <button type="button" onClick={this.setAllocation()}>
                        Commit
                    </button>
                    {JSON.stringify(this.state.allocation)}
                    {this.state.tokens.length}
                </div>
                <div className="checklist-item">
                    3. Set your DCA amount and interval
                    {" "}
                    <div hidden={this.state.isActive}>
                        <button type="button" onClick={this.commitPayment()}>
                            Commit
                        </button>
                    </div>
                    <div hidden={!this.state.isActive}>
                        Installments: {this.state.installments}
                        Period: {this.state.period}
                        Auto-renew: <input type="checkbox" checked={this.state.autoRenew} onChange={this.toggledAutoRenew()} />
                    </div>
                </div>
            </div>
        );
    }
}

export default withAuth0(Checklist);
