import { GetInfoReturn } from '../../models';
import UserDAL from './userDAL';

// TODO: better errors

export const getUserInfoByUsername = async (username: string): Promise<GetInfoReturn> => {
    const user = await UserDAL.getUserByUsername(username);
    if (!user) {
        throw new Error('No user found');
    }

    return user.getInfo();
};
