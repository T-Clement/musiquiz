const mysql = require('mysql2/promise');

let pool;


try {

    if(process.env.NODE_ENV === 'prod') {
        const dbUrl = new URL(process.env.DATABASE_URL);
        pool = mysql.createPool({
            host: dbUrl.hostname, // Utiliser le hostname extrait de l'URL (ici, mysql-container-muziquiz)
            port: dbUrl.port || 3306, // Utiliser le port depuis l'URL ou 3306 par défaut
            user: dbUrl.username, // Utiliser l'utilisateur extrait de l'URL
            password: dbUrl.password, // Utiliser le mot de passe extrait de l'URL
            database: dbUrl.pathname.replace('/', ''), // Extraire le nom de la base de données en retirant le "/" initial
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });

    } else {
        pool = mysql.createPool({
            host: 'localhost',
            port: 3306,
            user: 'musiquiz',
            password: 'musiquiz',
            database: 'musiquiz',
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });
        
    }



    console.log("Database connection established successfully.");
} catch (error) {
    console.error("Not able to connect to database: " + error);
    throw error; // propagate error
}


module.exports = pool;