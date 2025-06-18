const pool = require('../db/index');
const fs = require('fs');
const path = require('path');

module.exports = async () => {
  const sqlScript = fs.readFileSync(path.join(__dirname, 'test-setup.sql'), 'utf-8');
  await pool.query(sqlScript);
};