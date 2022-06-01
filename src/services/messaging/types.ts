import { Rank } from '../../models';

// util types
interface MessageData {
    id: string;
    username: string;
    rank: string;
    text: string;
    timestamp: Date;
}

// general socket types
export interface SocketCookies {
    accessToken?: string;
}

export interface SocketUserData {
    username: string;
    rank: Rank;
}

// events
export interface ClientToServerEvents {
    join_room: (roomID: string) => void;
    message: (message: string) => void;
}

export interface ServerToClientEvents {
    // join logic
    join_failed: (reason: string) => void;
    joined_successfully: () => void;
    // message logic
    message_recieved: (message: MessageData) => void;
}
