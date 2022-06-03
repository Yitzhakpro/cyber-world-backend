import { Server, Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { JWT } from '@fastify/jwt';
import Cookie from 'cookie';
import { nanoid } from 'nanoid';
import { verifySavedToken } from '@utils';
import { UserDecodedToken } from '@types';
import { ClientToServerEvents, ServerToClientEvents, SocketUserData, SocketCookies, EnterMode, MessageData } from './types';

// TODO: better error handling

type ServerMessageSocket = Server<ClientToServerEvents, ServerToClientEvents, DefaultEventsMap, SocketUserData>;
type ClientMessageSocket = Socket<DefaultEventsMap, ServerToClientEvents, DefaultEventsMap, SocketUserData>;

export default class SocketMessaingController {
    private socketServer: ServerMessageSocket;
    private jwtUtility: JWT;

    constructor(socketServer: ServerMessageSocket, jwtUtility: JWT) {
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

            socket.on('enter_room', (roomID, enterMode) => {
                this.enterRoom(roomID, enterMode, socket);
            });

            socket.on('leave_room', () => {
                this.leaveRoom(socket);
            });

            socket.on('message', (message) => {
                this.sendMessage(socket, message);
            });

            socket.on('disconnecting', () => {
                this.leaveRoom(socket);
            });

            socket.on('disconnect', (reason) => {
                const { username = 'USER', rank = 'user' } = socket.data;

                console.log(`[${rank}]${username} disconncted, reason: ${reason}`);
            });
        });
    }

    private checkIfRoomExists(roomID: string): boolean {
        if (this.socketServer.sockets.adapter.rooms.has(roomID)) {
            return true;
        }

        return false;
    }

    private checkIfAlreadyInRoom(socket: ClientMessageSocket): boolean {
        if (socket.rooms.size > 1) {
            return true;
        }

        return false;
    }

    private enterRoom(roomID: string, enterMode: EnterMode, socket: ClientMessageSocket): boolean {
        const { username = 'USER', rank = 'user' } = socket.data;

        if (enterMode === 'create' && this.checkIfRoomExists(roomID)) {
            console.log(`[!] '${username}' can't create room: ${roomID} because this room already exists`);
            return socket.emit('join_failed', 'This room already exists, try a different id');
        } else if (enterMode === 'join' && !this.checkIfRoomExists(roomID)) {
            console.log(`[!] '${username}' can't join room: ${roomID} because this room doesn't exist`);
            return socket.emit('join_failed', 'This room ID does not exist, try to enter the correct one');
        } else if (enterMode === 'join' && this.checkIfAlreadyInRoom(socket)) {
            console.log(`[!] '${username}' can't join room: ${roomID} because he is already inside a room`);
            return socket.emit('join_failed', 'You are already in another room, try to quit / refresh your browser');
        }

        const joinMessage: MessageData = {
            id: nanoid(),
            username,
            rank,
            text: 'Joined the room',
            timestamp: new Date(),
        };

        socket.join(roomID);
        console.log(`[v] '${socket.data.username}' joined room: ${roomID}`);
        socket.to(roomID).emit('message_recieved', joinMessage);
        return socket.emit('joined_successfully');
    }

    private leaveRoom(socket: ClientMessageSocket): void {
        const { username = 'USER', rank = 'user' } = socket.data;
        const currentRoom = [...socket.rooms][1];

        socket.leave(currentRoom);

        const disconnectMessage: MessageData = {
            id: nanoid(),
            username,
            rank,
            text: 'Left the room',
            timestamp: new Date(),
        };
        console.log(`[v] 'test' left room: ${currentRoom}`);
        this.socketServer.to(currentRoom).emit('message_recieved', disconnectMessage);
    }

    private sendMessage(socket: ClientMessageSocket, message: string): void {
        const { username = 'USER', rank = 'user' } = socket.data;
        const currentRoom = [...socket.rooms][1];

        const messageData: MessageData = {
            id: nanoid(),
            username,
            rank,
            text: message,
            timestamp: new Date(),
        };

        console.log(`${username} sent: ${message} to: ${currentRoom}`);
        this.socketServer.to(currentRoom).emit('message_recieved', messageData);
    }
}
