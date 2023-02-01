import "../styles/front.css";
import type { ReactElement } from "react";
import React from "react";
import { FrequentlyAskedQuestions } from "./faq";
import { Callout } from "./callout";
import { Custodial } from "./custodial";
import { DollarCostAverage } from "./dca";
import { Fee } from "./fee";
import { Stats } from "./stats";

export const Front = (): ReactElement => {

    return (
        <div className="front">
            <Callout />
            <Stats />
            <Custodial />
            <DollarCostAverage />
            <Fee />
            <FrequentlyAskedQuestions />
        </div>
    );
};
