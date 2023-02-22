import "../styles/complete.css";
import type { ReactElement } from "react";
import React, { useCallback } from "react";
import { useNavigation } from "../modules/navigation";

const Complete = (): ReactElement => {
    const { setOpenComplete } = useNavigation();

    // Source address is correct and not a smart contract
    // Destination address is correct
    // Destination memo is correct (if included)
    // Send funds using both the address and memo (if needed)

    // Send only ATOM to this deposit address.
    // Ensure the network is Cosmos.

    const closeModal = useCallback(() => setOpenComplete(false), []);

    return (
        <>
            <div className="complete-overlay" onClick={closeModal} />
            <div className="complete-popup">
                Content
            </div>
        </>
    );
};

const OptionalComplete = (): ReactElement | null => {
    const { openComplete } = useNavigation();
    return openComplete ? <Complete /> : null;
};

export default OptionalComplete;
