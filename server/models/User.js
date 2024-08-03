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

        // placeholder in query 
        const query = 'SELECT * FROM Users WHERE id = ?';
        const values = [id];
        
        try {
            
            const [rows, fields] = await pool.execute(query, values);

            // no user found
            if (rows.length === 0) {
                console.log("No User found with id: " + id);
                return null;
            }

            const { id: userId, pseudo, password, email, createdAt, updatedAt } = rows[0];
            return new User(userId, pseudo, password, email, createdAt, updatedAt);
            // return new User(...rows[0]);


           
        } catch (error) {
            console.error('Error finding user : ' + error.message);
            throw error;
        }
    }








}




module.exports = User;