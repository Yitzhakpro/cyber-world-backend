import type { GetInfoReturn } from '../../models';

export interface RegisterResponse {
    userInfo: GetInfoReturn;
}

export interface LoginResponse {
    success: boolean;
    userInfo?: GetInfoReturn;
}
