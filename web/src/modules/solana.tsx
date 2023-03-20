import type { PropsWithChildren, ReactElement } from "react";
import React, { useMemo } from "react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { clusterApiUrl } from "@solana/web3.js";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { GlowWalletAdapter } from "@solana/wallet-adapter-glow";
import { CoinbaseWalletAdapter } from "@solana/wallet-adapter-coinbase";
import { TrustWalletAdapter } from "@solana/wallet-adapter-trust";
import { TokenPocketWalletAdapter } from "@solana/wallet-adapter-tokenpocket";
import { LedgerWalletAdapter } from "@solana/wallet-adapter-ledger";
import { SolflareWalletAdapter } from "@solana/wallet-adapter-solflare";
import { SolongWalletAdapter } from "@solana/wallet-adapter-solong";
import { MathWalletAdapter } from "@solana/wallet-adapter-mathwallet";

export const SolanaProvider = (props: PropsWithChildren): ReactElement => {
    const network = useMemo(() => {
        return window.location.hostname === "jewl.app"
            ? WalletAdapterNetwork.Mainnet
            : WalletAdapterNetwork.Devnet;
    }, []);
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);

    const wallets = useMemo(() => {
        return [
            new PhantomWalletAdapter(),
            new SolflareWalletAdapter(),
            new SolongWalletAdapter(),
            new MathWalletAdapter(),
            new LedgerWalletAdapter(),
            new GlowWalletAdapter(),
            new CoinbaseWalletAdapter(),
            new TrustWalletAdapter(),
            new TokenPocketWalletAdapter()
        ];
    }, [network]);

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                {props.children}
            </WalletProvider>
        </ConnectionProvider>
    );
};
