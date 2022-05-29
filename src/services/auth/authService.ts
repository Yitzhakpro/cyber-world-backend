import AuthDAL from './authDAL';
import { UserDAL } from '../user';
import { IsAuthenticatedResponse, RegisterResponse, LoginResponse } from './types';

// TODO: better errors

export const saveToken = async (username: string, token: string): Promise<void> => {
    await AuthDAL.setUsernameToken(username, token);
};

export const getSavedUserToken = async (username: string): Promise<string> => {
    const savedToken = await AuthDAL.getUserToken(username);
    if (!savedToken) {
        throw new Error('no token found');
    }

    return savedToken;
};

export const isAuthenticated = async (username: string): Promise<IsAuthenticatedResponse> => {
    const user = await UserDAL.getUserByUsername(username);
    if (!user) {
        return { loggedIn: false };
    }

    const userInfo = user.getInfo();

    return { loggedIn: true, userInfo };
};

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
