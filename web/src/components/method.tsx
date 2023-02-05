import "../styles/method.css";
import { useAuth0 } from "@auth0/auth0-react";
import type { IPaymentMethodResponse } from "jewl-core";
import type { ReactElement } from "react";
import React, { useCallback, useEffect, useState, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCreditCard } from "@fortawesome/free-solid-svg-icons";
import { faAlipay, faCcAmex, faCcDinersClub, faCcDiscover, faCcJcb, faCcMastercard, faCcVisa, faIdeal, faPix, faStripe, faWeixin } from "@fortawesome/free-brands-svg-icons";
import { apiClient } from "../modules/network";

export const Method = (): ReactElement => {
    const [paymentMethod, setPaymentMethod] = useState<IPaymentMethodResponse | null>(null);
    const { getAccessTokenSilently } = useAuth0();

    useEffect(() => {
        getAccessTokenSilently()
            .then(async x => apiClient.getPaymentMethod(x))
            .then(setPaymentMethod)
            .catch(console.log);
    }, []);

    const setupPayment = useCallback(() => {
        getAccessTokenSilently()
            .then(async x => apiClient.setupPaymentMethod(x, new URL(window.location.origin)))
            .then(x => { window.location.href = x.redirect.toString(); })
            .catch(console.log);
    }, []);

    const deletePayment = useCallback(() => {
        getAccessTokenSilently()
            .then(async x => apiClient.deletePaymentMethod(x))
            .then(() => setPaymentMethod(null))
            .catch(console.log);
    }, []);

    const paymentIcon = useMemo(() => {
        if (paymentMethod == null) { return faCreditCard; }
        switch (paymentMethod.subtype) {
            case "visa": return faCcVisa;
            case "mastercard": return faCcMastercard;
            case "amex": return faCcAmex;
            case "discover": return faCcDiscover;
            case "jcb": return faCcJcb;
            case "diners": return faCcDinersClub;
            default: break;
        }
        switch (paymentMethod.type) {
            case "alipay": return faAlipay;
            case "customer_balance": return faStripe;
            case "ideal": return faIdeal;
            case "link": return faStripe;
            case "pix": return faPix;
            case "wechat_pay": return faWeixin;
            default: break;
        }
        return faCreditCard;
    }, [paymentMethod]);

    return (
        <div className="method">
            1. Set up a Payment method
            {" "}
            <button type="button" onClick={setupPayment} hidden={paymentMethod != null}>Connect</button>
            <div onClick={deletePayment} hidden={paymentMethod == null}>
                <FontAwesomeIcon icon={paymentIcon} />
                {paymentMethod?.last4 ?? ""}
            </div>
        </div>
    );

};
