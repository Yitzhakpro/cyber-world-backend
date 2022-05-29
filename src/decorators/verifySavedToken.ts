import { FastifyPluginAsync, FastifyReply, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';
import { authService } from '@services';
import config from '@config';
import { UserDecodedToken } from '../types';

// TODO: Add better errors

const accessTokenName = config.get('auth.cookie.name');

declare module 'fastify' {
    export interface FastifyInstance {
        verifyAgainstSavedToken: (request: FastifyRequest, reply: FastifyReply) => Promise<any>;
    }
}

const verifySavedToken: FastifyPluginAsync = async (fastify, opts) => {
    fastify.decorate('verifyAgainstSavedToken', async (request: FastifyRequest, reply: FastifyReply) => {
        const accessToken = request.cookies[accessTokenName];
        const decodedToken = fastify.jwt.decode(accessToken) as UserDecodedToken | null;
        if (!decodedToken) {
            reply.send('invalid token');
            return reply;
        }

        const savedToken = await authService.getSavedUserToken(decodedToken.username);
        if (accessToken !== savedToken) {
            reply.status(403).send('Cannot verify saved token');
            return reply;
        }
    });
};

export default fp(verifySavedToken);
