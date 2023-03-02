import type { ILog } from "jewl-core";
import { Log, Subscription } from "jewl-core";
import { stripeClient } from "../modules/network.js";
import type { Document } from "mongoose";
import { nanoid } from "nanoid";

/**
    A helper interface for an Log DB object.
**/
interface LogDocument extends ILog, Document { }

/**
    Upload a batch of logs to Stripe by taking summing all the credits
    from the logs together. This method requires the batch to all have
    the same `userId` and the same `idempotencyId` (or all null). If
    something goes wrong along the way the inconsistent DB entries are
    cleaned up so this doesn't keep trying to upload inconsistent entries.
**/
const uploadUsage = async (logs: Array<LogDocument>): Promise<void> => {
    console.log(logs);
    if (logs.length === 0) { return; }
    const identifiers = { userId: { $in: logs.map(x => x.userId) } };
    let idempotencyId = logs[0].idempotencyId;
    if (idempotencyId == null) {
        idempotencyId = nanoid();
        await Log.updateMany(identifiers, { idempotencyId });
    }

    const userId = logs[0].userId;
    const subscription = await Subscription.findOne({ userId });
    if (subscription == null) {
        await Log.updateMany(identifiers, { stripeId: "subscription.no.longer.active" });
        return;
    }

    const stripe = await stripeClient.getSubscriptions(subscription.stripeId);
    if (stripe.data.length === 0 || stripe.data[0].items.data.length === 0) {
        await Subscription.deleteOne({ userId });
        await Log.updateMany(identifiers, { stripeId: "subscription.no.longer.active" });
        return;
    }

    const subscriptionId = stripe.data[0].items.data[0].id;
    const quantity = logs.reduce((cumlative, current) => cumlative + current.credits, 0);
    const response = await stripeClient.updateUsage(subscriptionId, quantity, idempotencyId);
    await Log.updateMany(identifiers, { stripeId: response.id });
};

/**
    Find all the usages that might have failed uploading to Stripe and retry
    the upload. This accumulates all Log DB entires that do have a `idempotencyId`
    but not a `stripeId`. This batches them together based on the `idempotencyId`
    which also implies they all have the same `userId` and reupload them to Stripe.
**/
const reuploadFailedUsages = async (): Promise<void> => {
    const logs = await Log.find({ idempotencyId: { $ne: null }, stripeId: null });
    const batches = new Map<string, Array<LogDocument>>();

    for (const log of logs) {
        const idempotencyId = log.idempotencyId ?? "";
        const current = batches.get(idempotencyId) ?? [];
        batches.set(idempotencyId, current.concat([log]));
    }

    for (const batch of batches.values()) {
        await uploadUsage(batch);
    }
};

/**
    Find all the new usages (since the last time this has run) by finding
    all Log DB entries that don't have `idempotencyId` and `stripeId`. Batch
    these logs together by `userId` and upload them to Stripe.
**/
const uploadNewUsages = async (): Promise<void> => {
    const logs = await Log.find({ idempotencyId: null, stripeId: null });
    const batches = new Map<string, Array<LogDocument>>();

    for (const log of logs) {
        const current = batches.get(log.userId) ?? [];
        batches.set(log.userId, current.concat([log]));
    }

    for (const batch of batches.values()) {
        await uploadUsage(batch);
    }
};

/**
    This method does two things sequentially. (1) look in the DB for any
    inconsisten logs (`idempotencyId` but no `stripeId`) and tries to reupload
    them. (2) take all the new usages (neither a `idempotencyId` or `stripeId`)
    and upload them to Stripe.
**/
export const updateUsageToStripe = async (): Promise<void> => {
    await reuploadFailedUsages();
    await uploadNewUsages();
};
