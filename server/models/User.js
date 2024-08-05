const pool = require('../db');


class User {

    static tableName = "mqz_users";

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
        const query = `SELECT * FROM ${this.tableName} WHERE id = ?`;
        const values = [id];
        
        try {
            
            const [rows, fields] = await pool.execute(query, values);

            // no user found
            if (rows.length === 0) {
                console.log("No User found with id: " + id);
                return null;
            }

            const { id: userId, pseudo, password, email, createdAt, updatedAt } = rows[0];
            return new User(userId, pseudo, null, email, createdAt, updatedAt);
            // return new User(...rows[0]);


           
        } catch (error) {
            console.error('Error finding user : ' + error.message);
            throw error;
        }
    }




    static async findOneUser(pseudo, passwordHash) {

        const query = `SELECT * FROM ${this.tableName} WHERE pseudo = ? AND password = ?`;
        
        const values = [pseudo, passwordHash]; // password is hashed

        try {

            const [rows, fields] = await pool.execute(query, values);

            if(rows.length === 0) {
                return null; // no match for this credentials
            }
            
            const { id: userId, pseudo, password, email, createdAt, updatedAt } = rows[0];
            return new User(userId, pseudo, null, email, createdAt, updatedAt);

        } catch (error) {
            console.error('Error finding user in login : ' + error.message);
            throw error;
        }
    }



    static async checkMail(email) {
        const query = `SELECT * FROM ${this.tableName} WHERE email = ?`;
        const values = [email];

        const [rows, fields] = await pool.execute(query, values);

        if(rows.length !== 0) {
            return false;
        } else {
            return true;
        }
    }



    static async checkPseudo(pseudo) {
        const query = `SELECT * FROM ${this.tableName} WHERE pseudo = ?`;
        const values = [pseudo];


        const [rows, fields] = await pool.execute(query, values);

        if(rows.length !== 0) {
            return false;
        } else {
            return true;
        }
    }




    static async insertNewUser(pseudo, hashedPassword, email) {

        const query = `INSERT INTO ${this.tableName} (pseudo, password, email, createdAt, updatedAt) VALUES(?, ?, ?, NOW(), NOW())`;
        const values = [pseudo, hashedPassword, email];

        try {
    
            const [result] = await pool.execute(query, values);
            const insertedId = result.insertId;

            // fetch the inserted user data
            const [rows] = await pool.execute(`SELECT * FROM ${this.tableName} WHERE id = ?`, [insertedId]);

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