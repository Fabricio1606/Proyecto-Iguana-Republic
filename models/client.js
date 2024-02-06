// models/client.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Client = sequelize.define('Client', {
    idClient: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    nameClient: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    mailClient: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    nationClient: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phoneClient: {
        type: DataTypes.STRING,
        defaultValue: 'N/A',
    },
    addressClient: {
        type: DataTypes.STRING,
        defaultValue: 'N/A',
    },
    userClient: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    passClient_hash: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    adminUser: {
        type: DataTypes.BOOLEAN,
    },
}, {
    underscored: false, // Evita la conversión camelCase a snake_case
    tableName: 'Client', // Establece el nombre de la tabla según la definición proporcionada
});

module.exports = Client;
