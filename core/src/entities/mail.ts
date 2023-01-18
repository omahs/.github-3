import { Schema } from "mongoose";
import { createModel } from "../utility/mongo.js";

export enum MailState {
    pending = 0,
    sent = 1
}

export enum MailType {
    welcome = 0,
    paymentAnnounce = 1,
    paymentComplete = 2,
    paymentFailed = 3,
    transferComplete = 4,
    invoice = 5
}

export interface IMail {
    userId: string;
    state: MailState;
    type: MailType;
    data: Record<string, string>;
    mailId?: string;
}

export const MailSchema = new Schema<IMail>({
    userId: { type: String, required: true },
    state: { type: Number, enum: MailState, required: true },
    type: { type: Number, enum: MailType, required: true },
    data: { type: Map, of: String, default: { } },
    mailId: { type: String }
});

export const Mail = createModel<IMail>(MailSchema, "mails");
