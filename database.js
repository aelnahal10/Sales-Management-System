const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');
const config = require('./config/config.json'); // Adjust the path to where your config.json is

// Depending on your NODE_ENV, use development, test, or production.
// If NODE_ENV is not set, default to 'development'.
const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

// Connect using the configuration from config.json
const sequelize = new Sequelize(
    dbConfig.database,
    dbConfig.username,
    dbConfig.password,
    {
        host: dbConfig.host,
        dialect: dbConfig.dialect,
        dialectOptions: dbConfig.dialectOptions
    }
);

// Import models and associate them, if needed
const db = {};
fs.readdirSync(path.join(__dirname, 'models'))
    .filter(file => 
        file.endsWith('.js') &&
        file !== 'index.js' // Exclude the index.js file
    )
    .forEach(file => {
        const model = require(path.join(__dirname, 'models', file))(sequelize, Sequelize.DataTypes);
        db[model.name] = model;
    });


Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
