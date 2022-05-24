import type { GetInfoReturn } from '../../models';

export interface LoginResponse {
    success: boolean;
    userInfo?: GetInfoReturn;
}
