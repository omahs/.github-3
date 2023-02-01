import "../styles/stats.css";
import type { IStatistic } from "jewl-core";
import type { ReactElement } from "react";
import React, { useEffect, useState } from "react";
import { apiClient } from "../modules/network";

export const Stats = (): ReactElement => {
    const [statsItems, setStatsItems] = useState<Array<IStatistic>>([]);

    useEffect(() => {
        apiClient.getStats()
            .then(x => setStatsItems(x.stats))
            .catch(console.log);
    }, []);

    const items = statsItems.map(x => {
        return (
            <div className="stats-item" key={x.metric}>
                <div className="stats-item-value">{x.value.toString()}</div>
                <div className="stats-item-metric">{x.metric}</div>
            </div>
        );
    });

    return (
        <div className="stats" >
            <div className="stats-list" hidden={statsItems.length === 0}>
                {items}
            </div>
            <div className="stats-separator" hidden={statsItems.length !== 0} />
        </div>
    );
};
