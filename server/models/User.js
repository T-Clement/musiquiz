const pool = require('../db');


class User {
    constructor(id = null, pseudo, password, email, createdAt = "", updatedAt = "") {
        this.id = id;
        this.pseudo = pseudo;
        this.password = password;
        this.email = email;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }


    static async findOneUser(id) {

        const query = 'SELECT * FROM Users WHERE id = ?';
        const values = [id];

        try {
            const row = await pool.execute(query, values);
            if(row) {
                // console.log(row);
                const { id, pseudo, password, email, createdAt, updatedAt } = row[0][0]; // array of responses, why ???
                return new User( id, pseudo, password, email, createdAt, updatedAt );

            } else {
                return null;
            }
        } catch (error) {
            throw error;
        }
    }


}




module.exports = User;