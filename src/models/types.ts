import type { Model } from 'mongoose';
// User
type Rank = 'owner' | 'mod' | 'helper' | 'user';

export interface IUser {
    email: string;
    username: string;
    password: string;
    birthDate: Date;
    rank: 'owner' | 'mod' | 'helper' | 'user';

    createdAt: Date;
    updatedAt: Date;
}

export interface GetInfoReturn {
    username: string;
    rank: Rank;
    above18: boolean;
    memberSince: Date;
}

export interface IUserMethods {
    getInfo(): GetInfoReturn;
    checkPassword(password: string): Promise<boolean>;
}

export type UserModel = Model<IUser, Record<string, unknown>, IUserMethods>;
