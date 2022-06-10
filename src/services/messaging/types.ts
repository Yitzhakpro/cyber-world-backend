import { Rank } from '../../models';

// util types
export type EnterMode = 'create' | 'join';

type Action = 'join' | 'leave' | 'message';

export interface MessageData {
    id: string;
    username: string;
    rank: string;
    action: Action;
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
    get_all_rooms: () => void;
    enter_room: (roomID: string, enterMode: EnterMode) => void;
    leave_room: () => void;
    message: (message: string) => void;
}

export interface ServerToClientEvents {
    all_rooms: (allRooms: string[]) => void;
    // join logic
    join_failed: (reason: string) => void;
    joined_successfully: (roomInfo: SocketUserData[]) => void;
    // message logic
    message_recieved: (message: MessageData) => void;
}
