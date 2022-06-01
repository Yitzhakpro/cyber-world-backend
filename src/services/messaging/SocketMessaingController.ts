import { Server, Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { JWT } from '@fastify/jwt';
import Cookie from 'cookie';
import { verifySavedToken } from '@utils';
import { UserDecodedToken } from '@types';
import { SocketCookies } from './types';
import { Rank } from '../../models';

// TODO: better error handling

interface SocketUserData {
    username: string;
    rank: Rank;
}

export default class SocketMessaingController {
    private socketServer: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, SocketUserData>;
    private jwtUtility: JWT;

    constructor(socketServer: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, SocketUserData>, jwtUtility: JWT) {
        this.socketServer = socketServer;
        this.jwtUtility = jwtUtility;

        /*
            Middleware to verify the authentication of the user
            also using for associate username and rank to socket
        */
        this.socketServer.use(async (socket, next) => {
            const socketCookiesHeader = socket.handshake.headers.cookie || '';
            const socketCookies = Cookie.parse(socketCookiesHeader) as SocketCookies;

            const currentToken = socketCookies.accessToken || '';

            try {
                const decodedToken = this.jwtUtility.decode(currentToken) as UserDecodedToken;

                const { username, rank } = decodedToken;
                const isVerified = await verifySavedToken(currentToken, username);

                if (!isVerified) {
                    return next(new Error('access token not verified'));
                    // socket.disconnect();
                }

                // associate username and rank to socket object
                socket.data.username = username;
                socket.data.rank = rank;
                next();
            } catch (err) {
                next(new Error('Could not verify'));
            }
        });

        this.socketServer.on('connection', (socket) => {
            console.log(`[${socket.data.rank}]${socket.data.username} connected`);

            socket.on('join_room', (roomID: string) => {
                const alreadyInRoom = this.checkIfAlreadyInRoom(socket);

                if (alreadyInRoom) {
                    console.log(`[!] '${socket.data.username}' can't join room: ${roomID} because he is already in a room`);
                    socket.emit('join_failed', 'you already in room, try to refresh your browser');
                } else {
                    socket.join(roomID);
                    console.log(`[v] '${socket.data.username}' joined room: ${roomID}`);
                    socket.emit('joined_successfully');
                }
            });

            socket.on('message', (message: string) => {
                console.log(`${socket.data.username} sent: ${message}`);
            });

            socket.on('disconnect', (reason) => {
                console.log(`[${socket.data.rank}]${socket.data.username} disconncted, reason: ${reason}`);
            });
        });
    }

    checkIfAlreadyInRoom(socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, SocketUserData>): boolean {
        if (socket.rooms.size > 1) {
            return true;
        }

        return false;
    }
}
