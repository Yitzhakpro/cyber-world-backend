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
