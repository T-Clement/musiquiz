const pool = require ('../db/index');
const fs = require ('fs');



const setupTestDatabase = async () => {
    const sqlScript = fs.readFileSync('./tests/test-setup.sql', 'utf-8');

    try {

        await pool.query(sqlScript);
        console.log('Test database initialized');



    } catch (error) {
        console.error('Error initializing test database : ' + error.message);
        throw error;
    }


}

module.exports = setupTestDatabase;