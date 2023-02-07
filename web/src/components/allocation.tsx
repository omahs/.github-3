import { useAuth0 } from "@auth0/auth0-react";
import type { IAllocationItem } from "jewl-core";
import { PreciseNumber } from "jewl-core";
import type { ReactElement } from "react";
import React, { useState, useEffect, useCallback } from "react";
import { coinbaseClient, apiClient } from "../modules/network";

export const Allocation = (): ReactElement => {
    const [tokens, setTokens] = useState<Array<string>>([]);
    const [allocation, setAllocation] = useState<Array<IAllocationItem> | null>(null);
    const { getAccessTokenSilently } = useAuth0();

    useEffect(() => {
        coinbaseClient.getProducts()
            .then(products => setTokens(products.map(x => x.base_currency === "EUR" ? x.quote_currency : x.base_currency)))
            .catch(console.error);
    }, []);

    useEffect(() => {
        getAccessTokenSilently()
            .then(async x => apiClient.getAllocation(x))
            .then(x => x?.allocation ?? null)
            .then(setAllocation)
            .catch(console.error);
    }, []);

    const commitAllocation = useCallback(() => {
        const btc = [
            { currency: "BTC", percentage: new PreciseNumber(1), address: "bc1qlf5797zh08f4e7nr3u2znmem0c95043hh5y230" }
        ];
        getAccessTokenSilently()
            .then(async x => apiClient.setAllocation(x, btc))
            .then(() => setAllocation(btc))
            .catch(console.error);
    }, []);

    return (
        <div className="allocation">
            2. Set up your preferred allocation
            {" "}
            <button type="button" onClick={commitAllocation}>
                Commit
            </button>
            {JSON.stringify(allocation)}
            {tokens.length}
            {/* Your new allocation will go into effect for your next payment */}
        </div>
    );
};
