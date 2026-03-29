const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Bin = sequelize.define('Bin', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false }, // e.g., "Banjara Hills Sector 4"
    location: { type: DataTypes.STRING, allowNull: false },
    maxCapacity: { type: DataTypes.INTEGER, defaultValue: 100 }, // kilograms capacity
    currentFill: { type: DataTypes.FLOAT, defaultValue: 0 }, // current weight
    fillPercentage: { type: DataTypes.FLOAT, defaultValue: 0 }, // 0 to 100 relative to capacity
    status: { type: DataTypes.STRING, defaultValue: 'Active' }, // Active, Maintenance, Full
    lastUpdated: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
});

module.exports = Bin;
