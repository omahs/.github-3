import { DateTime, Mail, MailState, MailType, Transfer, TransferState } from "jewl-core";
import { coinbaseClient } from "../modules/network.js";

export const transferJob = async (): Promise<void> => {
    const cursor = Transfer.find({ state: TransferState.initiated }).cursor();
    for await (const transfer of cursor) {
        // Property coinbaseId is only null if transfer was interrupted which requires manual intervention
        if (transfer.coinbaseId == null) { continue; }
        const withdrawal = await coinbaseClient.getTransfer(transfer.coinbaseId);

        if (withdrawal.completed_at.eq(new DateTime(0))) { continue; }

        transfer.state = TransferState.completed;
        transfer.receipt = new URL("https://google.com"); // TODO: add explorer url
        await transfer.save();

        const mail = new Mail({
            userId: transfer.userId,
            entitiyId: transfer.id as string,
            state: MailState.pending,
            type: MailType.transfer,
            data: { currency: transfer.currency, amount: transfer.amount, address: transfer.destination }
        });
        await mail.save();
    }
};
