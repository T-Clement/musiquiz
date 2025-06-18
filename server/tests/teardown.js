const pool = require('../db/index');
module.exports = async () => {
    console.log("Fermeture connexion mariadb")
  await pool.end();
};