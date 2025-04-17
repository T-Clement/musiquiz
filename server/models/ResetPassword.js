const pool = require('../db');


class ResetPassword {

    static tableName = "password_reset_requests";


    constructor(id, token, id_user, created_at, used_at, expired_at) {
        this.id = id;
        this.token = token;
        this.id_user = id_user;
        this.created_at = created_at;
        this.used_at = used_at;
        this.expired_at = expired_at;
    }


    static async insertNewPasswordRequest(userId, token, expiration) {

        console.log(userId, token, expiration);
        //
        const query = `INSERT INTO ${this.tableName} (id_user, token, created_at ,expired_at ) VALUES (?, ?, NOW(), ?)`;
        const values = [userId, token, expiration];

        try {

            const [result] = await pool.execute(query, values);

            // if success
            return token;


        } catch (error) {
            console.error(`Error inserting new password reset request :  ${error.message}`);
            throw error;
        }


    }


    static async findActiveRequestByUser(userId) {
        // returns token
        

        const query = `
        SELECT * 
        FROM ${this.tableName}
        WHERE id_user = ? AND expired_at > NOW() AND used_at IS NULL LIMIT 1`;
        const values = [userId];

        try {

        } catch(error) {
            console.error(`Error`)
        }

    }


    static async deleteExpiredRequests() {

    }



}


module.exports = ResetPassword;