import "../styles/confirm.css";
import type { ReactElement } from "react";
import React, { useCallback, useMemo } from "react";
import { useNavigation } from "../modules/navigation";
import { useEstimate } from "../modules/estimate";
import { useAddress } from "../modules/address";
import { CurrencyType } from "../modules/enum";

const Confirm = (): ReactElement => {
    const { setOpenComplete } = useNavigation();
    const { deliveryTime, setEditing } = useEstimate();
    const { address } = useAddress();

    const buttonDisabled = useMemo(() => {
        if (deliveryTime == null) { return true; }
        if (address == null) { return true; }
        return false;
    }, [deliveryTime, address]);

    const buttonClicked = useCallback(() => {
        if (buttonDisabled) { return; }
        setOpenComplete(true);
        setEditing(CurrencyType.Input);
    }, [buttonDisabled, setOpenComplete, setEditing]);

    return (
        <button type="button" className="confirm" onClick={buttonClicked} disabled={buttonDisabled}>
            Confirm
        </button>
    );
};

export default Confirm;
