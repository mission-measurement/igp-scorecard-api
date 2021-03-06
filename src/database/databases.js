const mysql = require('mysql');
const util = require('util');

const pool = mysql.createPool({
  connectionLimit: 10,
  user: process.env.DB_USER || 'admin',
  password: process.env.DB_PASSWORD || 'knK5rtkkBd6sGzgG',
  database: process.env.DB_NAME || 'igp_apps_db',
  port: process.env.DBPORT || 3306,
  host:
    process.env.DB_HOST ||
    'igp-prod-cad-db.cqu7lxotxvmg.ca-central-1.rds.amazonaws.com',
});

pool.getConnection((err, connection) => {
  if (err) {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error('Database connection was closed.');
    }
    if (err.code === 'ER_CON_COUNT_ERROR') {
      console.error('Database has too many connections.');
    }
    if (err.code === 'ECONNREFUSED') {
      console.error('Database connection was refused.');
    }
  }

  if (connection) connection.release();
  return;
});

pool.query = util.promisify(pool.query);

module.exports = pool;
