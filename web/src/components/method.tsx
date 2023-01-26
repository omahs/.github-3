import "../styles/method.css";
import { useAuth0 } from "@auth0/auth0-react";
import type { IPaymentMethodResponse } from "jewl-core";
import type { ReactElement } from "react";
import React, { useCallback, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCreditCard } from "@fortawesome/free-solid-svg-icons";
import { faAlipay, faCcAmex, faCcDinersClub, faCcDiscover, faCcJcb, faCcMastercard, faCcVisa, faIdeal, faPix, faStripe, faWeixin } from "@fortawesome/free-brands-svg-icons";
import { apiClient } from "../modules/network";

export const Method = (): ReactElement => {
    const [paymentMethod, setPaymentMethod] = useState<IPaymentMethodResponse | null>(null);
    const { getAccessTokenSilently } = useAuth0();

    useEffect((): void => {
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

    let paymentIcon = faCreditCard;

    if (paymentMethod != null) {
        switch (paymentMethod.subtype) {
            case "visa": paymentIcon = faCcVisa; break;
            case "mastercard": paymentIcon = faCcMastercard; break;
            case "amex": paymentIcon = faCcAmex; break;
            case "discover": paymentIcon = faCcDiscover; break;
            case "jcb": paymentIcon = faCcJcb; break;
            case "diners": paymentIcon = faCcDinersClub; break;
            default: break;
        }
        switch (paymentMethod.type) {
            case "alipay": paymentIcon = faAlipay; break;
            case "customer_balance": paymentIcon = faStripe; break;
            case "ideal": paymentIcon = faIdeal; break;
            case "link": paymentIcon = faStripe; break;
            case "pix": paymentIcon = faPix; break;
            case "wechat_pay": paymentIcon = faWeixin; break;
            default: break;
        }
    }

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
