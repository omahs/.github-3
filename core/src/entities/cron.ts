import { Schema } from "mongoose";
import type { DateTime } from "../utility/date.js";
import { DateTimeSchema } from "../utility/date.js";
import { createModel } from "../utility/mongo.js";

export interface ICron {
    cron: string;
    key: string;
    notBefore: DateTime;
}

const CronSchema = new Schema<ICron>({
    cron: { type: String, required: true, sparse: true },
    key: { type: String, required: true, sparse: true },
    notBefore: { ...DateTimeSchema, required: true }
});

export const Cron = createModel<ICron>(CronSchema, "crons");
