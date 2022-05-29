import { UserDecodedToken } from '../src/types';

declare module 'fastify' {
    export interface FastifyRequest {
        user: UserDecodedToken | null;
    }
}
