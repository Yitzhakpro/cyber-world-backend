import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { Server } from 'socket.io';
import Cookie from 'cookie';
import { verifySavedToken } from '../../utils';
import config from '@config';
import { UserDecodedToken } from '../../types';

// TODO: Add better errors

const corsConfig = config.get('cors');

const messaging: FastifyPluginAsync = async (fastify, opts) => {
    try {
        const io = new Server(fastify.server, { cors: { ...corsConfig } });

        io.use(async (socket, next) => {
            const socketCookieHeader = socket.handshake.headers.cookie || '';
            const socketCookies = Cookie.parse(socketCookieHeader) as { accessToken?: string };

            const currentToken = socketCookies.accessToken || '';

            const decodedToken = fastify.jwt.decode(currentToken) as UserDecodedToken | null;
            if (!decodedToken) {
                next(new Error('no token'));
                return;
            }
            const { username } = decodedToken;

            const isVerified = await verifySavedToken(currentToken, username);

            if (isVerified) {
                next();
            }

            next(new Error('Could not verify token'));
            socket.disconnect();
        });

        io.on('connection', (socket) => {
            console.log('client connected');

            socket.on('disconnect', () => {
                console.log('client disconnected');
            });
        });

        fastify.decorate('io', io);
        fastify.log.info('Initialized socket io server');
    } catch (err) {
        throw new Error('Failed in socket io');
    }
};

export default fp(messaging);
