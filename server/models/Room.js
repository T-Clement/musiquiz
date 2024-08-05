const pool = require('../db');

class Room {

    static tableName = "mqz_rooms";

    constructor(id, name, api_id_playlist, description, themeId) {
        this.id = id;
        this.name = name;
        this.api_id_playlist = api_id_playlist;
        this.description = description;
        this.themeId = themeId;
    }




    static async findOneRoomById(id) {
        const query = `SELECT * FROM ${this.tableName} WHERE id = ?`;
        const values = [id];
        
        try {
            const [rows, fields] = await pool.execute(query, values);

            if(rows.length === 0) {
                console.log("No Room found with id : " + id);
                return null;
            }


            const { id: roomId, name, api_id_playlist, description, themeId } = rows[0];
            
            // null to api_id_playlist
            console.log(new Room(roomId, name, null, description, themeId));
            return new Room(roomId, name, null, description, themeId);



        } catch (error) {
            console.error('Error finding room : ' + error.message);
            throw error;
        }
    }





}


module.exports = Room;