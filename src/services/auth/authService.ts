import { UserDAL } from '../user';
import { RegisterResponse, LoginResponse } from './types';

// TODO: better errors

export const register = async (email: string, username: string, password: string, birthDate: string): Promise<RegisterResponse> => {
    const createdUser = await UserDAL.createUser(email, username, password, birthDate);
    const createdUserInfo = createdUser.getInfo();

    return { userInfo: createdUserInfo };
};

export const login = async (email: string, password: string): Promise<LoginResponse> => {
    const user = await UserDAL.getUserByEmail(email);
    if (!user) {
        return { success: false }; // email is wrong
    }

    const isPassCorrect = await user.checkPassword(password);
    if (isPassCorrect) {
        return { success: true, userInfo: user.getInfo() };
    }

    return { success: false };
};
