const pool = require('../db');


class Theme {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }

    static async findOneThemeById(id) {
        const query = 'SELECT * FROM Theme WHERE id = ?';
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

}