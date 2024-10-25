const mysql = require('mysql');
const util = require('util');
const { HOST_NAME, USER_NAME, PASSWORD, DATABASE } = require('./variables');

const pool = mysql.createPool({
  host: HOST_NAME,
  user: USER_NAME,
  password: PASSWORD,
  database: DATABASE,
});

// Promisify the pool's query method to use with async/await
pool.query = util.promisify(pool.query);

// Check connection events
pool.on('connection', (connection) => {
  console.log('Database connected as id ' + connection.threadId);
});

pool.on('error', (err) => {
  console.error('Database connection error:', err);
});

pool.on('end', () => {
  console.log('Database connection pool has ended');
});

module.exports = pool;
