const pool = require('../db');
const Room = require('./Room');


class Game {

    static tableName = "mqz_games";

    constructor(id, score, date_score, id_user, id_room) {
        this.id = id;
        this.score = score;
        this.date_score = date_score;
        this.id_user = id_user,
        this.id_room = id_room;
    }


    getId() {
        return this.id;
    }

    getRoomId() {
        return this.id_room;
    }


    getUserId() {
        return this.id_user;
    }



    static async getLastGamesOfUser(user_id, limit = 5) {
        const query = `
        SELECT ${this.tableName}.*, ${Room.tableName}.name 
        FROM ${this.tableName}
        LEFT JOIN ${Room.tableName} ON ${this.tableName}.id_room = ${Room.tableName}.id
        WHERE id_user = ? 
        ORDER BY date_score 
        DESC LIMIT ${limit}`;

        const values = [user_id];
        
        try {
            const [rows, fields] = await pool.execute(query, values);


            if (rows.length === 0) {
                console.log("No Games found for user with id: " + user_id);
                return [];
            }

            // console.log(rows);

            return rows.map(row => ({
                game: new Game (row.id, row.score, row.date_score, row.id_user, row.id_room), 
                metaData: {name : row.name, link: `/room/${row.id_room}`} 
            }));
    
        } catch (error) {
            console.error('Error finding last games of user : ' + error.message);

        }


        return ;
    }

    //** */
    static async insertNewEndedGame (id_user, score, id_room) {
        const query = `
        INSERT INTO ${this.tableName} (score, date_score, id_user, id_room) VALUES (?, NOW(), ?, ?);
        `;

        const values = [score, id_user, id_room];

        try {
            const [result] = await pool.execute(query, values);
            if(result.affectedRows == 1) {
                // new inserted row in database
                return result.insertId;
            } 


        } catch (error) {
            console.error('Error inserting ended game data : ' + error.message);
            throw error;
            
        }


    }


}

module.exports = Game;