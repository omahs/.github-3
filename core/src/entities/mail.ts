import { Schema } from "mongoose";
import { createModel } from "../utility/mongo.js";

export enum MailState {
    pending = 0,
    sent = 1
}

export enum MailType {
    payment = 1,
    refund = 2,
    transfer = 3,
    failed = 4,
    invoice = 5
}

export interface IMail {
    userId: string;
    entityId: string;
    state: MailState;
    type: MailType;
    data: Record<string, string>;
    mailId?: string;
}

export const MailSchema = new Schema<IMail>({
    userId: { type: String, required: true, sparse: true },
    entityId: { type: String, required: true, sparse: true },
    state: { type: Number, enum: MailState, required: true },
    type: { type: Number, enum: MailType, required: true },
    data: { type: Map, of: String, default: { } },
    mailId: { type: String, sparse: true }
});

export const Mail = createModel<IMail>(MailSchema, "mails");
