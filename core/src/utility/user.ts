import type { Document } from "mongoose";
import { Mail, MailState, MailType } from "../entities/mail.js";
import type { IUser } from "../entities/user.js";
import { User } from "../entities/user.js";

export const getOrCreateUser = async (userId: string): Promise<IUser & Document> => {
    let user = await User.findOne({ userId });
    if (user == null) {
        user = new User({ userId });
        await user.save();

        const mail = new Mail({
            userId,
            state: MailState.pending,
            type: MailType.welcome
        });
        await mail.save();
    }
    return user;
};
