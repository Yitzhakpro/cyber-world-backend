import type { GetInfoReturn } from '../src/models';

interface UserDecodedToken extends GetInfoReturn {
    iat: number;
    exp: number;
}

declare module 'fastify' {
    export interface FastifyRequest {
        user: UserDecodedToken | null;
    }
}
