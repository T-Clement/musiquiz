const pool = require('../db');


class User {

    static tableName = "mqz_users";

    // ajouter le code HTTP ?
    static errorsMessages = {
        pseudoAlreadyExists: "Un utilisateur s'est déjà enregistré avec ce pseudo",
        emailAlreadyExists: "Un utilisateur s'est déjà enregistré avec ce mail",
        idNotFound: "Aucun utilisateur trouvé avec cet identifiant",
        newUserNotInserted: "L'utilisateur inséré n'a pas été trouvé dans la base de données",
        
    }



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


    static async findManyUsersByIds(ids) {
        if (!Array.isArray(ids) || ids.length === 0) {
            console.log("No ids provided to findManyUsersByIds");
            return [];
        }

        // create placeholder string for the number of ids
        const placeholders = ids.map(() => '?').join(',');
        const query = `SELECT * FROM ${this.tableName} WHERE id IN (${placeholders})`;
        
        try {
            const [rows, fields] = await pool.execute(query, ids);

            if (rows.length === 0) {
                console.log("No Users found with the provided ids");
                return [];
            }

            return rows.map(row => new User(row.id, row.pseudo, null, null, row.createdAt, row.updatedAt));
            
        } catch (error) {
            console.error('Error finding users by ids : ' + error.message);
            throw error;
        }
    }

    static async getUserForGame(id) {
        
        const query = `SELECT * FROM ${this.tableName} WHERE id = ?`;
        const values = [id];
        
        try {
            const [rows, fields] = await pool.execute(query, values);


            if (rows.length === 0) {
                console.log("No User found with id: " + id);
                return null;
            }


            const { id: userId, pseudo, password, email, createdAt, updatedAt } = rows[0];
            return { id, pseudo };
            // return new User(...rows[0]);
        } catch (error) {
            console.error('Error finding user for game : ' + error.message);

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


    static async findUserByMail(email) {
        const query = `SELECT * FROM ${this.tableName} WHERE email = ?`;
        const values = [email];
        

        try {

            const [rows, fields] = await pool.execute(query, values);

            if(rows.length === 0) {
                return null;
            } else {
                return new User(rows[0].id, rows[0].pseudo, rows[0].password, rows[0].email, rows[0].createdAt, rows[0].updatedAt);
            }

        } catch(error) {
            console.error("Error finding user by mail : " + error.message);
            throw error;
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
            return new User(id, pseudo, null, email, createdAt, updatedAt);
            
        } catch (error) {
            console.error('Error inserting new user in Database : ' + error.message);
            throw error;
        }


    }



    static async checkCredentialsUser(email, hashedPassword) {
        const query = `SELECT * FROM ${this.tableName} WHERE email = ? AND password = ?`;
        const values = [email, hashedPassword];

        try {
            const [rows, fields] = await pool.execute(query, values);

            if(rows.length === 0) {
                return null; // no match for this credentials
            }
            
            const { id: userId, pseudo, password, email, createdAt, updatedAt } = rows[0];
            return new User(userId, pseudo, null, email, createdAt, updatedAt);

        } catch(error) {
            console.error(`Error checking user credentials in table ${this.tableName} : ` + error.message);
            throw error;
        }

    }

    static async updatePassword (userId, hashedPassword) {
        const query = `UPDATE ${this.tableName} SET password = ? WHERE id = ?`;
        const values = [hashedPassword, userId];

        try {
            const [rows, fields] = await pool.execute(query, values);
            // needs to return something ???

        } catch(error) {
            console.error(`Error updating user password in table ${this.tableName} : ` + error.message);
            throw error;
        }


    }


    getPseudo () {
        return this.pseudo;
    }

    getEmail () {
        return this.email;
    }

    getId () {
        return this.id;
    }

    getPassword() {
        return this.password;
    }


   

}




module.exports = User;