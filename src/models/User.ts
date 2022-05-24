import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { IUser, IUserMethods, UserModel, GetInfoReturn } from './types';

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

userSchema.method('getInfo', function getInfo(this: IUser): GetInfoReturn {
    const { username, rank, birthDate, createdAt } = this;

    const diffInMS = new Date().getTime() - birthDate.getTime();
    const age = Math.trunc(diffInMS / 31_556_952_000); // 31,556,952,000 milliseconds in year

    return { username, rank, above18: age >= 18, memberSince: createdAt };
});

userSchema.method('checkPassword', async function checkPassword(this: IUser, password: string): Promise<boolean> {
    try {
        const isPassCorrect = await bcrypt.compare(password, this.password);

        return isPassCorrect;
    } catch (err) {
        // TODO: better error
        throw new Error('Failed to verify password');
    }
});

const User = mongoose.model<IUser, UserModel>('User', userSchema);

export default User;
