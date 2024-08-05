const pool = require('../db');

class Room {

    static tableName = "mqz_rooms";

    constructor(id, name, api_id_playlist, description, id_theme) {
        this.id = id;
        this.name = name;
        this.api_id_playlist = api_id_playlist;
        this.description = description;
        this.id_theme = id_theme;
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


            const { id: roomId, name, api_id_playlist, description, id_theme } = rows[0];
            
            // null to api_id_playlist
            console.log(new Room(roomId, name, null, description, id_theme));
            return new Room(roomId, name, null, description, id_theme);



        } catch (error) {
            console.error('Error finding room : ' + error.message);
            throw error;
        }
    }


    static async getRoomScores(roomId, limit = 20, offset = 0) {
        
        const Game = require('../models/Game'); 
        
        // console.log(Game.tableName);
        const tableNameGame = Game.tableName;

        // const query = `SELECT * FROM ${tableNameGame} WHERE id_room = ? ORDER BY score DESC LIMIT ? OFFSET ?`;
        const query = `SELECT * FROM ${tableNameGame} WHERE id_room = ? ORDER BY score DESC`;
        
        // const values = [roomId, parseInt(limit), parseInt(offset)];
        const values = [parseInt(roomId)];

        console.log("Executing query:", query);
        console.log("With values:", values);

        // console.log(tableNameGame);
        // console.log(values)
        try {

            // ----
            // ----
            // HERE
            // ----
            // ----
            const [rows, fields] = await pool.execute(query, values);
            // ----
            // ----
            // HERE
            // ----
            // ----

            console.log("Query results:", rows);
            
            return rows.map(row => new Game(row.id, row.score, row.date_score, row.id_user, row.id_room));



        } catch(error) {
            console.error('Error getting room games: ' + error.message);
            throw error;
        }



    }





}


module.exports = Room;