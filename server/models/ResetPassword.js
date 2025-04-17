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
        SELECT token 
        FROM ${this.tableName}
        WHERE id_user = ? AND expired_at > NOW() AND used_at IS NULL LIMIT 1`;
        const values = [userId];

        try {

            const [rows, fields] = await pool.execute(query, values);

            if(rows.length === 0) {
                return null;
            }

            const { token } = rows[0];
            return token;


        } catch(error) {
            console.error(`Error searching for active reset password request : ${error.message}`);
            throw error;
        }

    }


    static async deleteExpiredRequests() {
        const query = `
        DELETE FROM ${this.tableName} 
        WHERE expired_at < NOW() 
        AND used_at IS NULL`;

        const values = [];

        try {
            const [result] = await pool.execute(query, values);
            return result;
        } catch (error) {
            console.error('Error deleting expired tokens in request password table : ', error.message);
        }

    }


    static async findActiveRequestByToken(token) {
        const query = `
        SELECT id, id_user 
        FROM ${this.tableName} 
        WHERE token = ? 
        AND expired_at > NOW() 
        AND used_at IS NULL 
        LIMIT 1`;

        const values = [token];

        try {

            const [rows, fields] = await pool.execute(query, values);

            if(rows.length === 0) {
                return null;
            }

            // id of the request to used it as ref
            const { id, id_user } = rows[0];
            return { id, id_user };


        } catch(error) {
            console.error(`Error searching for active token reset password request : ${error.message}`);
            throw error;
        }
    }


    static async markRequestAsUsed(requestId) {
        const query = `UPDATE ${this.tableName} SET used_at = NOW() WHERE id = ?`;

        const values = [requestId];

        try {
            const [rows, fields] = await pool.execute(query, values); 
            
            // need to be returning something ??

        } catch (error) {
            console.error(`Error udpating password of user : ${error.message}`);
            throw error;

        }

    }


}


module.exports = ResetPassword;