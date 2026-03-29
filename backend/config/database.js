const { Sequelize } = require('sequelize');
const path = require('path');

// Initialize Sequelize to use a local SQLite file database.sqlite
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '..', 'database.sqlite'),
    logging: false // Disable raw SQL logging for a cleaner terminal
});

module.exports = sequelize;
