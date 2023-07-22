const pool = require('./index');
const bcrypt = require('bcrypt');
require('dotenv').config();

async function createUsersTable() {
    const query = `
        CREATE TABLE IF NOT EXISTS users (
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;

    return new Promise((resolve, reject) => {
        pool.query(query, (err, results) => {
            if (err) reject(err);
            else resolve(results);
        });
    });
}

async function hashPassword(password) {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) reject(err);
            else resolve(hashedPassword);
        });
    });
}

async function seedUsers() {
    const users = [
        { name: 'John Doe', email: 'john@example.com', password: 'john123' },
        { name: 'Jane Smith', email: 'jane@example.com', password: 'jane123' }
    ];

    const promises = users.map(async user => {
        const hashedPassword = await hashPassword(user.password);
        return new Promise((resolve, reject) => {
            const query = 'INSERT IGNORE INTO users (name, email, password) VALUES (?, ?, ?)';
            pool.query(query, [user.name, user.email, hashedPassword], (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    });

    return Promise.all(promises);
}

async function init() {
    try {
        await createUsersTable();
        console.log('Users table created or already exists.');

        await seedUsers();
        console.log('User data seeded.');
    } catch (error) {
        console.error('Error setting up database:', error);
    } finally {
        pool.end();  // Close all connections in the pool
    }
}

init();
