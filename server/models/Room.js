const pool = require('../db');
const Theme = require('./Theme');
const Game = require('./Game'); 

class Room {

    static tableName = "mqz_rooms";
    static ROOM_TITLE_MIN_LENGTH = 3;
    static ROOM_TITLE_MAX_LENGTH = 124;
    static ROOM_DESCRIPTION_MAX_LENGTH = 256;



    constructor(id, name, api_id_playlist, description, id_theme) {
        this.id = id;
        this.name = name;
        this.api_id_playlist = api_id_playlist;
        this.description = description;
        this.id_theme = id_theme;
    }



    getName() {
        return this.name;
    }


    static async findOneRoomById(id, withApiUrl = false) {
        const query = `SELECT * FROM ${this.tableName} WHERE id = ?`;
        const values = [id];
        
        try {
            const [rows, fields] = await pool.execute(query, values);

            if(rows.length === 0) {
                console.log("No Room found with id : " + id);
                // throw new Error("...");
                return null;
            }

            const { id: roomId, name, api_id_playlist, description, id_theme } = rows[0];
            
            // null to api_id_playlist
            console.log(new Room(roomId, name, withApiUrl ? api_id_playlist : null, description, id_theme));
            return new Room(roomId, name, withApiUrl ? api_id_playlist : null, description, id_theme);

        } catch (error) {
            console.error('Error in findingRoom method : ' + error.message);
            throw error;
        }
    }


    static async findOneRoomByTitle(title) {
        const query = `SELECT * FROM ${this.tableName} WHERE name = ?`;
        const values = [title];

        try {

            const [rows, fields] = await pool.execute(query, values);

            if(rows.length === 0) {
                return null;
            }

            const {id, name, api_id_playlist, description, id_theme} = rows[0];
            return new Room(id, name, api_id_playlist, description, id_theme);

        } catch (error) {
            console.error('Error finding room with specific title : ' + error.message);
            throw error;
        }
    }

    static async findOneRoomByPlaylistId(playlist_id) {
        const query = `SELECT * FROM ${this.tableName} WHERE api_id_playlist = ?`;
        const values = [playlist_id];

        try {

            const [rows, fields] = await pool.execute(query, values);

            if(rows.length === 0) {
                return null;
            }

            const {id, name, api_id_playlist, description, id_theme} = rows[0];
            return new Room(id, name, api_id_playlist, description, id_theme);

        } catch (error) {
            console.error('Error finding room with specific playlist_id : ' + error.message);
            throw error;
        }
    }


    static async insertNewRoom(title, playlist_id, description, theme_id) {

        const query = `INSERT INTO ${this.tableName} (name, api_id_playlist, description, id_theme) VALUES (?, ?, ?, ?)`;
        const values = [title, playlist_id, description, theme_id];

        try {

            const [result] = await pool.execute(query, values);
            const insertedId = result.insertId;

            const [rows] = await pool.execute(`SELECT * FROM ${this.tableName} WHERE id = ?`, [insertedId]);

            if (rows.length === 0) {
                throw new Error('Room not found after insertion');
            }

            const {id, name, api_id_playlist, description, id_theme} = rows[0];
            return new Room(id, name, api_id_playlist, description, id_theme);
            
        } catch (error) {
            console.error("Error inserting new user Room in Database : " + error.message);
            throw error;
        }
        

    }



    static async getRoomScores(roomId, limit = 20, offset = 0) {
        
        
        // console.log(Game.tableName);
        const tableNameGame = Game.tableName;

        // const query = 
        // `SELECT * FROM ${tableNameGame} WHERE id_room = ? ORDER BY score DESC LIMIT ? OFFSET ?`;
        
        const query = 
        `SELECT g.id_room, g.id_user, u.pseudo, g.id, g.date_score, g.score
        FROM ${tableNameGame} g
            JOIN mqz_users u ON u.id = g.id_user
            JOIN (
                SELECT id_user, MAX(score) AS max_score
                FROM ${tableNameGame}
                WHERE id_room = ?
                GROUP BY id_user
            ) gm ON g.id_user = gm.id_user AND g.score = gm.max_score
        WHERE g.id_room = ?
        ORDER BY g.score DESC
        LIMIT ? OFFSET ?;`
        
        // limit offset as string for execute() // as number with query()
        const values = [parseInt(roomId), parseInt(roomId), limit.toString(), offset.toString()];
        console.log(values);
    
        try {

            const [rows, fields] = await pool.execute(query, values);
            // console.log(rows);
            return rows.map(row => new Game(row.id, row.score, row.date_score, row.id_user, row.id_room));

        } catch(error) {
            console.error('Error getting room games: ' + error.message);
            throw error;
        }

    }


    static async getRandomRooms (count = 5) {
        const themeTableName = Theme.tableName;
        const query = `
            SELECT ${this.tableName}.id, ${this.tableName}.name, ${themeTableName}.name as theme
            FROM ${this.tableName}
            LEFT JOIN ${themeTableName} ON ${this.tableName}.id_theme = ${themeTableName}.id
            ORDER BY RAND()
            LIMIT ?
        `;
        const values = [count];
        

        try {
            const [rows, fields] = await pool.execute(query, values);
            
            if (rows.length === 0) {
                return null;
            }
            console.log(rows)
            return rows;

        } catch (error) {
            console.error('Error getting random rooms : ' + error.message);
            throw error;
        }
    }
    
    


}


// SELECT 
//     g.id_room, 
//     g.id_user, 
//     u.pseudo, 
//     g.id, 
//     g.date_score,
//     g.score AS score_max
// FROM mqz_games g
// JOIN mqz_users u ON u.id = g.id_user
// JOIN (
//     SELECT id_user, MAX(score) AS max_score
//     FROM mqz_games
//     WHERE id_room = 6
//     GROUP BY id_user
// ) gm ON g.id_user = gm.id_user AND g.score = gm.max_score
// WHERE g.id_room = 6
// ORDER BY g.score DESC
// LIMIT 0, 200;



module.exports = Room;