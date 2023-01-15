import type { IUser } from "jewl-core";
import { User } from "jewl-core";
import type { Document } from "mongoose";

export const getOrCreateUser = async (userId: string): Promise<IUser & Document> => {
    let user = await User.findOne({ userId });
    if (user == null) {
        user = new User({ userId });
        await user.save();
    }
    return user;
};
