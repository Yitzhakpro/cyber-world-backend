import { RoomSummeryInfo } from '../types';

export const parseServerRooms = (adapterRooms: Map<string, Set<string>>): RoomSummeryInfo[] => {
    const allRooms: RoomSummeryInfo[] = [];

    adapterRooms.forEach((roomMembers, room) => {
        if (!roomMembers.has(room)) {
            const usersCount = roomMembers.size;

            allRooms.push({ name: room, usersCount });
        }
    });

    return allRooms;
};
