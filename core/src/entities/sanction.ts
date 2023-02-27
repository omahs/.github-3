import { Schema } from "mongoose";
import { createModel } from "../utility/mongo.js";
import { Chain } from "./chain.js";

/**
    An enum that explains the source of a sanction.
**/
export enum SanctionType {
    OFAC = "Office of Foreign Assets Control (OFAC) Specially Designated Nationals List",
    BitcoinAbuse = "Bitcoin Abuse Database"
}

/**
    An interface for a tainted address.
**/
export interface ISanction {

    /**
        The indentifier of the address.
    **/
    id: string;

    /**
        The sanction list this address appears on.
    **/
    sanction: SanctionType;
}

/**
    A Model for validating the `ITaintReport` interface.
**/
export const Sanction = createModel<ISanction>(
    new Schema<ISanction>({
        id: { type: String, required: true, index: true },
        sanction: { type: String, enum: Chain, required: true, index: true }
    }),
    "sanctions"
);

/**
    An interface explaining a taint overview of an address or transaction.
**/
export interface ISanctionReponse {

    /**
        A list of sanction lists this address appears on. If this is an
        empty array that means this address does not appear on the searched
        sanction lists.
    **/
    sanctions: Array<SanctionType>;
}

/**
    A Model for validating the `ITaintResponse` interface.
**/
export const TaintResponse = createModel<ISanctionReponse>(
    new Schema<ISanctionReponse>({
        sanctions: { type: [String], enum: SanctionType, required: true }
    })
);
