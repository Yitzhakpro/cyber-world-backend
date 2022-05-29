import type { GetInfoReturn } from '../models';

export interface UserDecodedToken extends GetInfoReturn {
    iat: number;
    exp: number;
}
