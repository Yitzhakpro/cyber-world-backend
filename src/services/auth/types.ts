import type { GetInfoReturn } from '../../models';

export interface IsAuthenticatedResponse {
    loggedIn: boolean;
    userInfo?: GetInfoReturn;
}

export interface RegisterResponse {
    userInfo: GetInfoReturn;
}

export interface LoginResponse {
    success: boolean;
    userInfo?: GetInfoReturn;
}
