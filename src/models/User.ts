import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { IUser, IUserMethods, UserModel } from './types';

const userSchema = new mongoose.Schema<IUser, UserModel, IUserMethods>(
    {
        email: {
            type: String,
            lowercase: true,
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

userSchema.pre('save', async function (this, next) {
    try {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(this.password, salt);

        this.password = hashedPassword;
        next();
    } catch (err: any) {
        next(err);
    }
});

userSchema.method('getInfo', function getInfo(this: IUser): { username: string; createdAt: Date } {
    return { username: this.username, createdAt: this.createdAt };
});

const User = mongoose.model<IUser, UserModel>('User', userSchema);

export default User;
