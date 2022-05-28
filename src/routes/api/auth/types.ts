// register
export interface IRegisterBody {
    email: string;
    username: string;
    password: string;
    birthDate: string;
}

// login
export interface ILoginBody {
    email: string;
    password: string;
}
