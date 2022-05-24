import mongoose from 'mongoose';
import { IUser, IUserMethods, UserModel } from './types';

const userSchema = new mongoose.Schema<IUser, UserModel, IUserMethods>(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        username: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        birthDate: {
            type: Date,
            required: true,
        },
        rank: {
            type: String,
            default: 'user',
        },
    },
    { timestamps: true },
);
userSchema.method('getInfo', function getInfo(): { username: string; createdAt: Date } {
    return { username: this.username, createdAt: this.createdAt };
});

const User = mongoose.model<IUser, UserModel>('User', userSchema);

export default User;
