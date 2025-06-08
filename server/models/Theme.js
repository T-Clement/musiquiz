const pool = require('../db');
// const Game = require('./Game');
const User = require('./User');


class Theme {

    static tableName = "mqz_theme";

    constructor(id, name) {
        this.id = id;
        this.name = name;
    }

    static async findOneThemeById(id) {
        const query = `SELECT * FROM ${this.tableName} WHERE id = ?`;
        const values = [id];


        try {

            const [rows, fields] = await pool.execute(query, values);

            if(rows.length === 0) {
                console.log("No Theme found with id : " + id);
                return null;
            }

            const { id: themeId, name } = rows[0];
            return new Theme(themeId, name);

        } catch (error) {
            console.error('Error finding theme : ' + error.message);
            throw error;
        }

    }

    static async getThemes() {
        const query = `SELECT * FROM ${this.tableName};`;
        
        try {
            const [rows, fields] = await pool.execute(query, []);

            if(rows.length === 0) {
                return null;
            }
            console.log(rows)
            return rows.map(theme => {
                return new Theme(theme.id, theme.name);
            });

        } catch (error) {
            console.error('Error getting themes : ' + error.message);
            throw error;
        }
    }


    /**
     * Get all rooms of one theme with the best player and his score
     * @param {*} themeId 
     * @returns 
     */
    static async getRoomsOfOneTheme(themeId) {
        const Room = require("./Room");
        const Game = require("./Game");
        const query = `
        SELECT r.id AS room_id, 
            r.name AS room_name, 
            u.id AS user_id, 
            u.pseudo AS best_player,
            g.score AS best_score, 
            g.date_score AS date_best_score
        FROM ${Room.tableName} r
        LEFT JOIN ${Game.tableName} g ON g.id_room = r.id
        LEFT JOIN ${User.tableName} u ON g.id_user = u.id
        WHERE id_theme = ?
        AND (g.score = (
            SELECT MAX(score)
            FROM ${Game.tableName}
            WHERE id_room = r.id
            ) OR g.score IS NULL
        )
        ;`;

    //     const query = `
    //     SELECT g.id AS game_id, g.date_score, r.id AS room_id, u.id AS user_id, u.pseudo, g.score as current_bestscore, gp.games_played
    //     FROM ${Game.tableName} g
    //     JOIN ${User.tableName} u ON g.id_user = u.id
    //     JOIN ${Room.tableName} r ON g.id_room = r.id
    //     JOIN (
    //         SELECT id_room, COUNT(id) as games_played
    //         FROM ${Game.tableName}
    //         GROUP BY id_room
    //     ) gp ON r.id = gp.id_room
    //     WHERE g.score = (
    //         SELECT MAX(score)
    //         FROM ${Game.tableName}
    //         WHERE id_room = r.id
    //     )
    //     GROUP BY r.id, u.id, u.pseudo, g.id, g.date_score, g.score, gp.games_played
    //     ORDER BY gp.games_played DESC
    //     LIMIT 3;
    // `;


        const values = [themeId];

        try {
            const [rows, fields] = await pool.execute(query, values);

            if(rows.length === 0) {
                return [];
            }
            // console.log(rows);
            return rows.map(room => {
                return {
                    room_id: room.room_id,
                    room_name: room.room_name,
                    best_player: {
                        user_id: room.user_id,
                        pseudo: room.best_player,
                        best_score: room.best_score,
                        date_best_score: room.date_best_score,
                    },
                };
            })

        } catch(error) {
            console.error('Error getting rooms from Theme model : ' + error.message);
            throw error;
        }
    }

    

}

module.exports = Theme;