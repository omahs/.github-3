import { Schema } from "mongoose";
import { createModel } from "../utility/mongo.js";

/**
    An enum explaining the risk type.
**/
export enum RiskType {

    /**
        No information known.
    **/
    Unkown = 0
}

/**
    A single risk response item.
**/
export interface IRiskSource {

    /**
        The type of the risk.
    **/
    type: RiskType;

    /**
        The percentage of the address/transaction that this applies to.
    **/
    percentage: number;
}

/**
    A Model for validating the `IRiskSource` interface.
**/
export const RiskSource = createModel<IRiskSource>(
    new Schema<IRiskSource>({
        type: { type: Number, enum: RiskType, required: true },
        percentage: { type: Number, required: true }
    })
);

/**
    The holistic risk of a address/transaction.
**/
export interface IRiskResponse {

    /**
        The actual risk on a scale of 0 to 100.
    **/
    risk: number;

    /**
        The individual components that make up the risk score.
    **/
    source: Array<IRiskSource>;
}

/**
    A Model for validating the `IRiskResponse` interface.
**/
export const RiskResponse = createModel<IRiskResponse>(
    new Schema<IRiskResponse>({
        risk: { type: Number, required: true },
        source: { type: [RiskSource.schema], required: true }
    })
);
