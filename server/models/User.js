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


    static async findOneUserById(id) {

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




    static async findOneUser(pseudo, passwordHash) {

        const query = 'SELECT * FROM USERS WHERE pseudo = ? AND password = ?';
        
        const values = [pseudo, passwordHash]; // password is hashed


        try {

            const [rows, fields] = await pool.execute(query, values);

            if(rows.length === 0) {
                return null; // no match for this credentials
            }

            // !!!!!!!!!
            // !!!!!!!!!
            // TO UPDATE BECAUSE WE DONT WANT PASSWORD TO BE RETURNED
            // !!!!!!!!!
            // !!!!!!!!!
            
            const { id: userId, pseudo, password, email, createdAt, updatedAt } = rows[0];
            return new User(userId, pseudo, password, email, createdAt, updatedAt);
            
            // !!!!!!!!!
            // !!!!!!!!!
            // TO UPDATE BECAUSE WE DONT WANT PASSWORD TO BE RETURNED
            // !!!!!!!!!
            // !!!!!!!!!

        } catch (error) {
            console.error('Error finding user in login : ' + error.message);
            throw error;
        }
    }



    static async checkMail(email) {
        const query = 'SELECT * FROM Users WHERE email = ?';
        const values = [email];

        const [rows, fields] = await pool.execute(query, values);

        if(rows.length !== 0) {
            return false;
        } else {
            return true;
        }
    }



    static async checkPseudo(pseudo) {
        const query = 'SELECT * FROM Users WHERE pseudo = ?';
        const values = [pseudo];


        const [rows, fields] = await pool.execute(query, values);

        if(rows.length !== 0) {
            return false;
        } else {
            return true;
        }
    }




    static async insertNewUser(pseudo, hashedPassword, email) {

        const query = 'INSERT INTO Users (pseudo, password, email, createdAt, updatedAt) VALUES(?, ?, ?, NOW(), NOW())';
        const values = [pseudo, hashedPassword, email];

        try {
    
            const [result] = await pool.execute(query, values);
            const insertedId = result.insertId;

            // fetch the inserted user data
            const [rows] = await pool.execute('SELECT * FROM Users WHERE id = ?', [insertedId]);

            if (rows.length === 0) {
                throw new Error('User not found after insertion');
            }

            const { id, pseudo, password, email, createdAt, updatedAt } = rows[0];
            return new User(id, pseudo, password, email, createdAt, updatedAt);
            
        } catch (error) {
            console.error('Error inserting new user in Database : ' + error.message);
            throw error;
        }


    }




}




module.exports = User;