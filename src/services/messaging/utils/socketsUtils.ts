export const parseServerRooms = (adapterRooms: Map<string, Set<string>>): string[] => {
    const allRooms: string[] = [];

    adapterRooms.forEach((roomMembers, room) => {
        if (!roomMembers.has(room)) {
            allRooms.push(room);
        }
    });

    return allRooms;
};
