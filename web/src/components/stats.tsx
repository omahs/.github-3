import "../styles/stats.css";
import type { IStatistic, PreciseNumber } from "jewl-core";
import type { ReactElement } from "react";
import React, { useEffect, useState, useMemo } from "react";
import { apiClient } from "../modules/network";

interface IProps {
    metric: string;
    value: PreciseNumber;
}

const StatsItem = (props: IProps): ReactElement => {
    return (
        <div className="stats-item" key={props.metric}>
            <div className="stats-item-value">{props.value.toString()}</div>
            <div className="stats-item-metric">{props.metric}</div>
        </div>
    );
};

export const Stats = (): ReactElement => {
    const [statsItems, setStatsItems] = useState<Array<IStatistic>>([]);

    useEffect(() => {
        apiClient.getStats()
            .then(x => setStatsItems(x.stats))
            .catch(console.log);
    }, []);

    const items = useMemo(() => {
        return statsItems.map(x => <StatsItem key={x.metric} {...x} />);
    }, [statsItems]);

    return (
        <div className="stats" >
            <div className="stats-list" hidden={statsItems.length === 0}>{items}</div>
            <div className="stats-separator" hidden={statsItems.length !== 0} />
        </div>
    );
};
