import type { Model } from 'mongoose';
// User
export interface IUser {
    email: string;
    username: string;
    password: string;
    birthDate: Date;
    rank: 'owner' | 'mod' | 'helper' | 'user';

    createdAt: Date;
    updatedAt: Date;
}

export interface IUserMethods {
    getInfo(): { username: string; createdAt: Date };
}

export type UserModel = Model<IUser, Record<string, unknown>, IUserMethods>;
