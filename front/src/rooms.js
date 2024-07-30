
export const checkIfRoomExists = async (roomCode) => {
    try {
        console.warn("Dans la fonction");
        const response = await fetch("/currentRoomsAvailable.json");
        // if (!response) {
        //     throw new Error('Erreur lors du chargement des salles disponibles');
        // }
        const rooms = await response.json();
        console.warn(rooms);
        // console.log(response.json());
        return rooms.some(room => room.id === parseInt(roomCode));
    } catch (error) {
        console.error("Erreur lors du chargement des salles disponibles");
        // console.error(error);
        return false;
    }
}