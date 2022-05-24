import { UserDAL } from '../user';

export const register = async (email: string, username: string, password: string, birthDate: string) => {
    const createdUser = await UserDAL.createUser(email, username, password, birthDate);

    return createdUser;
};
