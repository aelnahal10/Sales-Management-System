const mysql = require('mysql2');
require('dotenv').config();

const DATABASE_URL='mysql://vd23hxqhwdiqxcool2p6:************@aws.connect.psdb.cloud/sms?ssl={"rejectUnauthorized":true}'
const databaseUrl = new URL(DATABASE_URL);

// Create a connection pool
const pool = mysql.createPool({
    connectionLimit: 10,  // adjust based on your requirements
    host: databaseUrl.hostname,
    user: databaseUrl.username,
    database: databaseUrl.pathname.substring(1), 
    password: databaseUrl.password,
    ssl: { rejectUnauthorized: true }  // You might want to adjust this part based on your actual SSL settings
});

pool.on('connection', (connection) => {
  console.log('MySQL pool connected: threadId ' + connection.threadId);
});

pool.on('release', (connection) => {
  console.log('MySQL pool released: threadId ' + connection.threadId);
});

// Handle pool errors (optional but recommended)
pool.on('error', (err) => {
    console.error('Database error:', err.stack);
});

module.exports = pool;
