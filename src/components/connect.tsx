import "../styles/connect.css";
import type { ReactElement } from "react";
import React, { useCallback, useMemo } from "react";
import type { Wallet } from "@solana/wallet-adapter-react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletReadyState } from "@solana/wallet-adapter-base";

const Connect = (): ReactElement => {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { connect, select, wallets } = useWallet();

    const connectWallet = useCallback((wallet: Wallet) => {
        return () => {
            const isInstalled = wallet.readyState === WalletReadyState.Installed;
            const isLoadable = wallet.readyState === WalletReadyState.Loadable;
            if (isInstalled || isLoadable) {
                select(wallet.adapter.name);
                setTimeout(() => {
                    connect().catch(() => { /* Ignore error */ });
                }, 200);
            } else {
                window.open(wallet.adapter.url, "_blank", "noopener,noreferrer");
            }
        };
    }, [select, connect, wallets]);

    const walletButtons = useMemo(() => {
        return wallets.map(wallet => {
            return (
                <button type="button" className="connect-button" key={wallet.adapter.name} onClick={connectWallet(wallet)}>
                    <img className="connect-image" src={wallet.adapter.icon} alt={`${wallet.adapter.name} logo`} />
                    <span className="connect-text">{wallet.adapter.name}</span>
                </button>
            );
        });
    }, [wallets]);

    return (
        <div className="connect">
            <div className="connect-title">Connect wallet</div>
            <div className="connect-buttons">{walletButtons}</div>
            <div className="connect-disclaimer">
                By connecting a wallet, you acknowledge that you have read and understood jewl.app&apos;s Terms of Service and Privacy Policy.
                <br /> <br />
                Since wallets are provided by third parties access may depend on these third parties being operational.
            </div>
        </div>
    );
};

export default Connect;
