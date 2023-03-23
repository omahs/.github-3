import "css:../styles/header.css";
import icon from "url:../../public/icon-outline.svg";
import type { ReactElement } from "react";
import React, { useCallback, useMemo, useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import Connect from "./connect";

const Header = (): ReactElement => {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { select, disconnect, publicKey } = useWallet();
    const [showModal, setShowModal] = useState(false);
    const isConnected = useMemo(() => publicKey != null, [publicKey]);

    useEffect(() => {
        setShowModal(false);
    }, [isConnected]);

    const loginPressed = useCallback(() => {
        if (isConnected) {
            select(null);
            setTimeout(() => {
                disconnect().catch(() => { /* Empty */ });
            }, 200);
        } else {
            setShowModal(true);
        }
    }, [isConnected, select, disconnect, setShowModal]);

    const closeModal = useCallback(() => {
        setShowModal(false);
    }, [setShowModal]);

    const popup = useMemo(() => {
        if (!showModal) { return null; }
        return (
            <>
                <div className="header-overlay" onClick={closeModal} />
                <Connect />
            </>
        );
    }, [showModal]);

    return (
        <div className="header">
            <span className="header-spacer" />
            <img src={icon} className="header-logo" alt="jewl.app logo" />
            <span className="header-spacer">
                <button type="button" onClick={loginPressed} className="header-login">
                    {isConnected ? "Disconnect" : "Connect"}
                </button>
            </span>
            {popup}
        </div>
    );
};

export default Header;
