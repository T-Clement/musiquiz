const mysql = require('mysql2/promise');
const fs = require('fs');


if(process.env.NODE_ENV === "test") {
    
    require("dotenv").config();
}

let pool;


try {

    if (process.env.NODE_ENV === 'prod' || process.env.NODE_ENV === "development") {
        // const dbUrl = new URL(process.env.DATABASE_URL);
        // console.log(dbUrl);
        pool = mysql.createPool({
            host: process.env.MYSQL_HOST,
            port: process.env.MYSQL_PORT,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
            // host: dbUrl.hostname, // Utiliser le hostname extrait de l'URL (ici, mysql-container-muziquiz)
            // port: dbUrl.port || 3306, // Utiliser le port depuis l'URL ou 3306 par défaut
            // user: dbUrl.username, // Utiliser l'utilisateur extrait de l'URL
            // password: dbUrl.password, // Utiliser le mot de passe extrait de l'URL
            // database: dbUrl.pathname.replace('/', ''), // Extraire le nom de la base de données en retirant le "/" initial
            // waitForConnections: true,
            // connectionLimit: 10,
            // queueLimit: 0
        });

        console.log(`Connected to MariaDB at ${dbUrl.hostname}:${dbUrl.port}`);

    } else if (process.env.NODE_ENV === "test") {

        pool = mysql.createPool({
            host: process.env.TEST_MYSQL_HOST,
            port: process.env.TEST_MYSQL_PORT,
            database: process.env.TEST_MYSQL_DATABASE,
            user: process.env.TEST_MYSQL_USER,
            password: process.env.TEST_MYSQL_PASSWORD,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
            multipleStatements: true,
        });

        console.log("Connected to MariaDB test database");
    
    } else {
        throw new Error(`Unsupported NODE_ENV value. Set it to a value in this list : ["prod", "development", "test"] Value used : ${process.env.NODE_ENV}`);
    }


} catch (error) {
    console.error("Not able to connect to database: " + error);
    throw error; // propagate error
}


module.exports = pool;