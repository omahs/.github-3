import { Transfer, TransferState } from "jewl-core";
import { coinbaseClient } from "../modules/network.js";

export const transferJob = async (): Promise<void> => {
    const cursor = Transfer.find({ state: TransferState.initiated }).cursor();
    for await (const transfer of cursor) {
        // Property coinbaseId is only null if transfer was interrupted which requires manual intervention
        if (transfer.coinbaseId == null) { continue; }
        const _withdrawal = await coinbaseClient.getTransfer(transfer.coinbaseId);

        // TODO: \/
        // Check on transfer status and add explorer url if completed
    }
};
