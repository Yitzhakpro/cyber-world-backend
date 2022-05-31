import { Server } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { JWT } from '@fastify/jwt';
import Cookie from 'cookie';
import { verifySavedToken } from '@utils';
import { UserDecodedToken } from '@types';
import { SocketCookies } from './types';

// TODO: better error handling

export default class SocketMessaingController {
    private socketServer: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
    private jwtUtility: JWT;

    constructor(socketServer: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>, jwtUtility: JWT) {
        this.socketServer = socketServer;
        this.jwtUtility = jwtUtility;

        this.socketServer.use(async (socket, next) => {
            const socketCookiesHeader = socket.handshake.headers.cookie || '';
            const socketCookies = Cookie.parse(socketCookiesHeader) as SocketCookies;

            const currentToken = socketCookies.accessToken || '';

            try {
                const decodedToken = this.jwtUtility.decode(currentToken) as UserDecodedToken;

                const { username } = decodedToken;
                const isVerified = await verifySavedToken(currentToken, username);

                if (!isVerified) {
                    next(new Error('access token not verified'));
                    // socket.disconnect();
                }

                next();
            } catch (err) {
                next(new Error('Could not verify'));
            }
        });

        this.socketServer.on('connection', (socket) => {
            console.log('Client connected');

            socket.on('disconnect', (reason) => {
                console.log(`Client disconncted, reason: ${reason}`);
            });
        });
    }
}
