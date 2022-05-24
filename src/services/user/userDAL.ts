import type { HydratedDocument } from 'mongoose';
import { User, UserModel, IUser, IUserMethods } from '../../models';

// TODO: add better errors

class UserDAL {
    userModel: UserModel;

    constructor() {
        this.userModel = User;
    }

    async createUser(email: string, username: string, password: string, birthDate: string): Promise<HydratedDocument<IUser, IUserMethods>> {
        try {
            const createdUser = await this.userModel.create({ email, username, password, birthDate });

            return createdUser;
        } catch (err) {
            throw new Error('Could not create user');
        }
    }

    async getUserById(id: string): Promise<HydratedDocument<IUser, IUserMethods> | null> {
        try {
            const user = await this.userModel.findById(id);

            return user;
        } catch (err) {
            throw new Error('Could not get user by id');
        }
    }

    async getUserByEmail(email: string): Promise<HydratedDocument<IUser, IUserMethods> | null> {
        try {
            const user = await this.userModel.findOne({ email });

            return user;
        } catch (err) {
            throw new Error('Could not get user by email');
        }
    }

    async getUserByUsername(username: string): Promise<HydratedDocument<IUser, IUserMethods> | null> {
        try {
            const user = await this.userModel.findOne({ username });

            return user;
        } catch (err) {
            throw new Error('Could not get user by username');
        }
    }
}

export default new UserDAL();
