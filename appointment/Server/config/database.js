const mysql = require('mysql2');
const { HOST_NAME, USER_NAME, PASSWORD, DATABASE } = require('./variables');

const pool = mysql.createPool({
    host: HOST_NAME,
    user: USER_NAME,
    password: PASSWORD,
    database: DATABASE
  });

  const promisePool = pool.promise();
// Check connection errors
pool.on('connection', (connection) => {
    console.log('Database connected as id ' + connection.threadId);
  });
  
  pool.on('error', (err) => {
    console.error('Database connection error:', err);
  });
  
  pool.on('end', () => {
    console.log('Database connection pool has ended');
  });
  
  module.exports = promisePool;

