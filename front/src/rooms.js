
export const checkIfRoomExists = async (roomCode) => {
    try {
        console.warn("Dans la fonction");
        const response = await fetch("/currentRoomsAvailable.json");
        if (!response) {
            throw new Error('Erreur lors du chargement des salles disponibles');
        }
        const rooms = await response.json();
        console.warn(rooms);
        return rooms.find(room => room.waitingRoomId === parseInt(roomCode));
    } catch (error) {
        console.error(error);
        return false;
    }
}