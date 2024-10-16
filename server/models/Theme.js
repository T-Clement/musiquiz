const pool = require('../db');


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



    static async getRoomsOfOneTheme(themeId) {
        const Room = require("./Room");
        const query = `SELECT * FROM ${Room.tableName} WHERE id_theme = ?;`

        const values = [themeId];

        try {
            const [rows, fields] = await pool.execute(query, values);

            if(rows.length === 0) {
                return [];
            }

            return rows.map(room => {
                return new Room(room.id, room.name, null, room.description, room.id_theme);
            })

        } catch(error) {
            console.error('Error getting rooms from Theme model : ' + error.message);
            throw error;
        }
    }

    

}

module.exports = Theme;