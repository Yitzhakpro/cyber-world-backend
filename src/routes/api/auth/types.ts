// general
// TODO: figure out better way to type the decoded token
export interface DecodedToken {
    username: string;
    rank: string;
    above18: boolean;
    memberSince: Date;
    iat: number;
    exp: number;
}

// register
export interface IRegisterBody {
    email: string;
    username: string;
    password: string;
    birthDate: string;
    rememberMe: boolean;
}

// login
export interface ILoginBody {
    email: string;
    password: string;
    rememberMe: boolean;
}
